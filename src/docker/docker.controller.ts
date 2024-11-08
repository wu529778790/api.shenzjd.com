import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

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

    try {
      const result = await this.updateDocker(dockerName, dockerComposeYml)
      return `Docker '${dockerName}' received and processed: ${result}`
    } catch (error) {
      return `Error processing Docker '${dockerName}': ${error.message}`
    }
  }

  private async updateDocker(dockerName: string, dockerComposeYml: string): Promise<string> {
    console.log('dockerName', dockerName, 'dockerComposeYml', dockerComposeYml)

    const targetDir = `/opt/1panel/apps/openresty/openresty/www/sites/${dockerName.split('/')[1]}`
    const execPromise = promisify(exec)

    try {
      // Change to the target directory
      process.chdir(targetDir)

      // Write the docker-compose.yml content to a file
      fs.writeFileSync(path.join(targetDir, 'docker-compose.yml'), dockerComposeYml)

      // Execute Docker commands and return the result or errors
      const { stdout, stderr } = await execPromise(`docker pull ${dockerName} && docker-compose up -d`)

      if (stderr) {
        throw new Error(stderr)
      }

      return stdout
    } catch (err) {
      throw new Error(`Failed to update Docker: ${err.message}`)
    }
  }
}
