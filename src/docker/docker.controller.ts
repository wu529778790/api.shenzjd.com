import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common'

@Controller('docker')
export class DockerController {
  @Get()
  @HttpCode(HttpStatus.OK)
  async handleDockerUpdate(@Query('dockerName') dockerName: string): Promise<string> {
    if (!dockerName) {
      return 'dockerName parameter is required'
    }

    await this.updateDocker(dockerName)

    return `Docker '${dockerName}' received and processed`
  }

  private async updateDocker(dockerName: string) {
    const { exec } = require('child_process')
    exec(`docker pull ${dockerName} && docker-compose up -d`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(`Error updating Docker: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    })
  }
}
