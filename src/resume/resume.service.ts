import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class ResumeService {
  private readonly HF_API_KEY = process.env.HUGGING_FACE_API_KEY; // Set Hugging Face API Key

  async generateResumeWithAI(prompt: string): Promise<string> {
    try {
      // Prepare the request body with the 'inputs' key for Hugging Face
      const requestBody = {
        inputs: prompt,
      };

      // Send the POST request to Hugging Face API for GPT-2 inference
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2', // Hugging Face GPT-2 API endpoint
        requestBody, // Pass the request body
        {
          headers: {
            Authorization: `Bearer ${this.HF_API_KEY}`, // Authorization header with API key
            'Content-Type': 'application/json', // Ensure JSON content
          },
        },
      );

      // Check if we have valid response data
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data[0]?.generated_text
      ) {
        return response.data[0].generated_text.trim(); // Return the generated text
      } else {
        throw new Error('Invalid response structure from Hugging Face API');
      }
    } catch (error: any) {
      console.error(
        'Error generating resume with Hugging Face AI:',
        error.message || error,
      );
      throw new Error(
        `Error generating resume with Hugging Face AI: ${error.message || error}`,
      );
    }
  }

  saveAsTXT(resumeText: string, filePath: string): void {
    try {
      fs.writeFileSync(filePath, resumeText, 'utf-8'); // Save the resume as a .txt file
    } catch (error) {
      console.error('Error saving resume to file:', error);
      throw new Error('Error saving resume to file');
    }
  }
}
