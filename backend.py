from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import json
import os
import sys
from typing import List, Dict, Any

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed, that's okay for production
    pass

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class GroqQuizGenerator:
    def __init__(self):
        self.client = None
        self.model_name = "llama-3.1-8b-instant"  # Fast Groq model (updated)
        self.initialize_groq()
    
    def initialize_groq(self):
        """Initialize Groq client."""
        try:
            # Get API key from environment
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key or api_key == 'your_groq_api_key_here':
                error_msg = "❌ GROQ_API_KEY not found or not properly configured"
                print(error_msg)
                print("💡 Get your free API key from: https://console.groq.com/keys")
                return False
            
            self.client = Groq(api_key=api_key)
            print("✅ Groq client initialized successfully")
            print(f"📄 Using model: {self.model_name}")
            return True
            
        except Exception as e:
            print(f"❌ Error initializing Groq client: {e}")
            return False

    def generate_quiz_question(self, topic: str, difficulty: str) -> Dict[str, Any]:
        """Generate a single quiz question using Groq."""
        system_prompt = f"""You are an expert quiz creator. Generate a single multiple-choice question about {topic} with {difficulty} difficulty.

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Option A",
  "explanation": "Brief explanation of the correct answer"
}}

Requirements:
- Exactly 4 options
- One correct answer that matches exactly one of the options
- Clear, concise explanation
- Appropriate difficulty level
- Question should be factual and have one clearly correct answer"""

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_prompt}
                ],
                temperature=0.7,
                max_tokens=500,
                response_format={"type": "json_object"}
            )
            
            raw_content = response.choices[0].message.content
            quiz_data = json.loads(raw_content)

            # Validate and normalize the response
            required_keys = ["question", "options", "correct_answer", "explanation"]
            if not all(key in quiz_data for key in required_keys):
                raise ValueError(f"Generated JSON missing required keys. Got: {list(quiz_data.keys())}")
            
            if not isinstance(quiz_data["options"], list) or len(quiz_data["options"]) != 4:
                raise ValueError("Options must be a list of exactly 4 strings.")
            
            # Find correct answer index
            correct_answer = quiz_data["correct_answer"]
            try:
                correct_index = quiz_data["options"].index(correct_answer)
            except ValueError:
                # If exact match fails, find the closest match
                correct_index = 0
                for i, option in enumerate(quiz_data["options"]):
                    if correct_answer.lower() in option.lower() or option.lower() in correct_answer.lower():
                        correct_index = i
                        break

            return {
                "question": quiz_data["question"],
                "options": quiz_data["options"],
                "correctAnswer": correct_index,
                "explanation": quiz_data["explanation"]
            }

        except Exception as e:
            print(f"❌ Error generating question: {e}")
            return None

    def generate_full_quiz(self, topic: str, difficulty: str, num_questions: int) -> List[Dict[str, Any]]:
        """Generate a complete quiz with multiple questions."""
        questions = []
        
        print(f"🤖 Generating {num_questions} questions about {topic} ({difficulty} difficulty)...")
        
        for i in range(num_questions):
            print(f"📝 Generating question {i + 1}/{num_questions}...")
            
            question_data = self.generate_quiz_question(topic, difficulty)
            if question_data:
                question_data["id"] = i + 1
                questions.append(question_data)
                print(f"✅ Question {i + 1} generated successfully")
            else:
                # Add a fallback question if generation fails
                fallback_question = {
                    "id": i + 1,
                    "question": f"This is a sample question about {topic}. What is the most important concept to understand?",
                    "options": [
                        "Understanding the fundamentals",
                        "Memorizing all details", 
                        "Skipping difficult parts",
                        "Only studying examples"
                    ],
                    "correctAnswer": 0,
                    "explanation": "Understanding fundamentals is always the key to learning any subject effectively."
                }
                questions.append(fallback_question)
                print(f"⚠️ Question {i + 1} used fallback due to generation error")
        
        print(f"🎉 Quiz generation complete! Generated {len(questions)} questions")
        return questions

# Initialize the quiz generator
quiz_gen = GroqQuizGenerator()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "groq_connected": quiz_gen.client is not None,
        "model": quiz_gen.model_name
    })

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz():
    """Generate a complete quiz based on parameters."""
    try:
        data = request.json
        topic = data.get('topic', '')
        difficulty = data.get('difficulty', 'medium')
        question_count = int(data.get('questionCount', 5))
        
        if not topic.strip():
            return jsonify({"error": "Topic is required"}), 400
        
        if not quiz_gen.client:
            return jsonify({"error": "Groq client not initialized"}), 500
        
        # Generate questions
        questions = quiz_gen.generate_full_quiz(topic, difficulty, question_count)
        
        quiz_data = {
            "title": f"{topic.title()} Quiz",
            "difficulty": difficulty,
            "questions": questions
        }
        
        return jsonify(quiz_data)
        
    except Exception as e:
        print(f"Error in generate_quiz: {e}")
        return jsonify({"error": "Failed to generate quiz"}), 500

@app.route('/validate-answer', methods=['POST'])
def validate_answer():
    """Validate a user's answer (optional endpoint for detailed feedback)."""
    try:
        data = request.json
        question = data.get('question')
        user_answer = data.get('userAnswer')
        correct_answer = data.get('correctAnswer')
        
        is_correct = user_answer == correct_answer
        
        return jsonify({
            "isCorrect": is_correct,
            "message": "Correct!" if is_correct else "Incorrect. Try again!"
        })
        
    except Exception as e:
        print(f"Error in validate_answer: {e}")
        return jsonify({"error": "Failed to validate answer"}), 500

if __name__ == '__main__':
    import os
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    if not quiz_gen.client:
        print("Failed to initialize Groq client. Make sure GROQ_API_KEY is set.")
        sys.exit(1)
    
    print("Starting Flask server...")
    print("Groq AI backend ready!")
    print(f"Using model: {quiz_gen.model_name}")
    print(f"Server will run on port: {port}")
    
    # Run in debug mode for development
    app.run(
        debug=True, 
        host='0.0.0.0', 
        port=port
    )

# This is required for Vercel deployment
app = app