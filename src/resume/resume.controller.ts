import { Controller, Post, Body, Res } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { Response } from 'express';
import * as fs from 'fs';
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('generate')
  async generateResume(
    @Body() body: { prompt: string; fileType: string },
    @Res() res: Response,
  ) {
    console.log('Generating resume with AI...');
    const { prompt, fileType } = body;
    const resumeText = await this.resumeService.generateResumeWithAI(prompt);

    // Save as the specified file type
    const filePath = `./resume.${fileType}`;
    this.resumeService.saveAsTXT(resumeText, filePath);

    res.download(filePath, () => {
      fs.unlinkSync(filePath); // Cleanup after download
    });
  }
}
