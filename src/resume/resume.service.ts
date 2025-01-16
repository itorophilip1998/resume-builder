import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class ResumeService {
  private readonly AI_API_KEY = process.env.OPEN_AI_API_KEY;

  async generateResumeWithAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.AI_API_KEY}`,
          },
        },
      );
      return response.data.choices[0].text.trim();
    } catch (error: any) {
      console.log(error);
      throw new Error(`Error generating resume with AI: ${error}`);
    }
  }

  saveAsTXT(resumeText: string, filePath: string): void {
    fs.writeFileSync(filePath, resumeText, 'utf-8');
  }
}
