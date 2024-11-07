import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

@Controller('docker')
export class DockerController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async handleDockerUpdate(
    @Body('dockerName') dockerName: string,
    @Body('dockerComposeYml') dockerComposeYml: string
  ): Promise<string> {
    if (!dockerName) {
      return 'dockerName parameter is required'
    }
    if (!dockerComposeYml) {
      return 'dockerComposeYml parameter is required'
    }

    await this.updateDocker(dockerName, dockerComposeYml)

    return `Docker '${dockerName}' received and processed`
  }

  private async updateDocker(dockerName: string, dockerComposeYml: string) {
    const targetDir = `/opt/1panel/apps/openresty/openresty/www/sites/${dockerName}`

    try {
      process.chdir(targetDir)

      fs.writeFileSync(path.join(targetDir, 'docker-compose.yml'), dockerComposeYml)

      exec(
        `docker pull ${dockerName} && docker-compose -f docker-compose.yml up -d`,
        (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error updating Docker: ${error.message}`)
            return
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`)
            return
          }
          console.log(`stdout: ${stdout}`)
        }
      )
    } catch (err) {
      console.error(`Failed to change directory or write file: ${err.message}`)
    }
  }
}
