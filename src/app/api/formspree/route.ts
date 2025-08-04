import { NextResponse } from 'next/server';

// Formspree endpoint - replace with your actual Formspree form ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

export async function POST(request: Request) {
  try {
    const formData = await request.json();
    
    // Send to Formspree
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        _subject: 'New Nexusagents Lead',
        _captcha: false, // Disable captcha for testing
      }),
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Lead submitted successfully to Formspree' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to submit to Formspree' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error submitting to Formspree:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
} 