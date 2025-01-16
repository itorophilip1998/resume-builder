import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class ResumeService {
  private readonly HF_API_KEY = process.env.HUGGING_FACE_API_KEY; // Set Hugging Face API Key in environment variables

  async generateResumeWithAI(prompt: string): Promise<string> {
    try {
      // Make a POST request to the Hugging Face API for GPT-2 inference
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2', // Hugging Face GPT-2 API endpoint
        {
          inputs: prompt, // The input prompt for the resume generation
        },
        {
          headers: {
            Authorization: `Bearer ${this.HF_API_KEY}`, // Authorization header with the Hugging Face API Key
            'Content-Type': 'application/json', // Ensure the content is JSON
          },
        },
      );

      // Check the response data to ensure the generation is complete
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data[0]?.generated_text
      ) {
        return response.data[0].generated_text.trim(); // Extract the generated resume text
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
