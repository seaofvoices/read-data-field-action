import { getInput, setFailed, setOutput, debug } from '@actions/core'

import { execute } from './execute'

async function run() {
  const filePath = getInput('file', { required: true })
  const field = getInput('field', { required: true })

  debug(`read input 'file' = ${JSON.stringify(filePath)}`)
  debug(`read input 'field' = ${JSON.stringify(field)}`)

  const result = await execute(filePath, field, debug)

  if (result.error) {
    setFailed(result.error)
    return
  }

  const outputValue = result.output

  setOutput('result', outputValue)
  setOutput('result_json', JSON.stringify(outputValue))
}

run()
