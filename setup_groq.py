#!/usr/bin/env python3
"""
Groq Setup Guide for AI Quiz Generator
"""

import os
import sys

def check_groq_setup():
    """Check if Groq is properly configured"""
    print("🔍 Checking Groq Setup...")
    print("=" * 40)
    
    # Check if groq package is installed
    try:
        import groq
        print("✅ Groq package is installed")
    except ImportError:
        print("❌ Groq package not installed")
        print("💡 Install with: pip install groq")
        return False
    
    # Check for API key
    api_key = os.getenv('GROQ_API_KEY')
    if api_key:
        print("✅ GROQ_API_KEY found in environment")
        # Mask the key for security
        masked_key = f"{api_key[:8]}...{api_key[-4:]}" if len(api_key) > 12 else "***"
        print(f"🔑 API Key: {masked_key}")
        
        # Test the connection
        try:
            client = groq.Groq(api_key=api_key)
            print("✅ Groq client initialized successfully")
            return True
        except Exception as e:
            print(f"❌ Error initializing Groq client: {e}")
            return False
    else:
        print("❌ GROQ_API_KEY not found in environment")
        print("\n🚀 How to get your Groq API key:")
        print("1. Go to: https://console.groq.com/keys")
        print("2. Sign up for a free account")
        print("3. Create a new API key")
        print("4. Set it as environment variable:")
        print("   Windows: set GROQ_API_KEY=your_key_here")
        print("   Linux/Mac: export GROQ_API_KEY=your_key_here")
        print("   Or create a .env file with: GROQ_API_KEY=your_key_here")
        return False

def create_env_file():
    """Create a .env file for API key"""
    api_key = input("\n🔑 Enter your Groq API key (or press Enter to skip): ").strip()
    if api_key:
        with open('.env', 'w') as f:
            f.write(f"GROQ_API_KEY={api_key}\n")
        print("✅ .env file created with your API key")
        print("🔄 Restart your terminal/IDE to load the environment variable")
        return True
    return False

def test_quiz_generation():
    """Test quiz generation with Groq"""
    try:
        from groq import Groq
        
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            print("❌ No API key available for testing")
            return False
        
        print("\n🧪 Testing quiz generation...")
        client = Groq(api_key=api_key)
        
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{
                "role": "system", 
                "content": """Generate a simple quiz question about Python programming in JSON format:
{
  "question": "What is Python?",
  "options": ["A programming language", "A snake", "A movie", "A game"],
  "correct_answer": "A programming language",
  "explanation": "Python is a high-level programming language."
}"""
            }],
            temperature=0.3,
            max_tokens=200,
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        print("✅ Test generation successful!")
        print(f"📝 Sample response: {result[:100]}...")
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    print("🤖 Groq AI Quiz Generator Setup")
    print("=" * 35)
    
    # Check current setup
    if check_groq_setup():
        print("\n🎉 Groq is ready to use!")
        
        # Test generation
        if test_quiz_generation():
            print("\n✅ Everything is working perfectly!")
            print("🚀 You can now run: python backend.py")
        else:
            print("\n⚠️ API key might be invalid or you've hit rate limits")
    else:
        print("\n🔧 Setup needed...")
        
        # Offer to create .env file
        if not os.path.exists('.env'):
            create_env = input("📝 Create .env file with API key? [y/N]: ").strip().lower()
            if create_env == 'y':
                if create_env_file():
                    print("\n🔄 Please restart your terminal and run this script again")
                    return
        
        print("\n📋 Next steps:")
        print("1. Get API key from: https://console.groq.com/keys")
        print("2. Set GROQ_API_KEY environment variable")
        print("3. Install dependencies: pip install -r requirements.txt")
        print("4. Run backend: python backend.py")

if __name__ == "__main__":
    main()