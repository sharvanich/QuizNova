# Groq AI Setup Guide

## Overview
This guide will help you set up Groq AI for your quiz generator. Groq provides fast, reliable AI inference with a generous free tier.

## Groq API Key Setup

**Cost**: Free tier available | **Quality**: Very Good | **Speed**: Extremely Fast

1. Go to https://console.groq.com/
2. Sign up with email
3. Go to API Keys section
4. Create new API key
5. **Free tier**: 14,400 requests/day (plenty for development and production)

## Local Development Setup

### Step 1: Copy environment file
```bash
cp .env.example .env
```

### Step 2: Add your Groq API key to `.env`
```bash
GROQ_API_KEY=gsk_your-key-here
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Test the setup
```bash
python setup_groq.py
```



## Cost Estimation

### Groq Pricing
- **Free Tier**: 14,400 requests/day (plenty for development and small production)
- **Production**: Very cost-effective compared to other providers
- **Speed**: Extremely fast inference (faster than OpenAI/Claude)

## Security Best Practices

### API Key Management
1. **Never commit API keys** to code
2. **Use environment variables** only
3. **Set usage limits** in provider dashboards
4. **Rotate keys** periodically
5. **Monitor usage** regularly

### Rate Limiting
- Groq has generous rate limits
- Built-in retry logic handles temporary failures
- Fallback to mock data if needed

## Testing Your Setup

### Test Groq Setup
```bash
# Test your Groq configuration
python setup_groq.py
```

### Test Full Quiz Generation
```bash
curl -X POST http://localhost:5000/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"topic":"JavaScript","difficulty":"medium","questionCount":3}'
```

## Groq Setup

Simply add your Groq API key to the `.env` file:
```bash
GROQ_API_KEY=gsk_your-key-here
```

## Troubleshooting

### Common Issues

1. **"Groq API key not found"**
   - Check your .env file has `GROQ_API_KEY=your_key_here`
   - Verify the key is not expired

2. **"Rate limit exceeded"**
   - Groq has generous free tier limits (14,400/day)
   - Wait and try again, or upgrade if needed

3. **"Model decommissioned"**
   - Update model name in backend.py if needed
   - Check console.groq.com for current models

## Ready to Go!

Once you have your Groq API key set up:
1. Your AI quiz generator will work reliably
2. Fast generation with Groq's optimized inference
3. Cost-effective with generous free tier
4. Professional-quality question generation

Start generating amazing quizzes with Groq AI!
