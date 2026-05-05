export const COMMANDS = [
  {
    id: 'sso-login',
    category: 'Authentication',
    name: 'SSO Login',
    description: 'Start an AWS SSO login session for a profile',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true, placeholder: 'dt-dev' },
    ],
    generate: ({ profile }) => `aws --profile ${profile} sso login`,
  },

  {
    id: 'ssm-put',
    category: 'SSM Parameters',
    name: 'Put Parameter',
    description: 'Create or update an SSM parameter',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true },
      { id: 'name', label: 'Parameter Name', type: 'text', required: true, placeholder: '/my-app/db/url' },
      { id: 'value', label: 'Value', type: 'textarea', required: true, placeholder: 'parameter-value' },
      {
        id: 'type',
        label: 'Type',
        type: 'select',
        required: true,
        default: 'String',
        options: [
          { value: 'String', label: 'String' },
          { value: 'SecureString', label: 'SecureString' },
          { value: 'StringList', label: 'StringList' },
        ],
      },
      { id: 'overwrite', label: 'Overwrite if exists', type: 'checkbox', default: true },
    ],
    generate: ({ profile, name, value, type, overwrite }) => {
      let cmd = `aws --profile ${profile} ssm put-parameter --name "${name}" --value "${value}" --type ${type}`
      if (overwrite) cmd += ' --overwrite'
      return cmd
    },
  },

  {
    id: 'ssm-get',
    category: 'SSM Parameters',
    name: 'Get Parameter',
    description: 'Retrieve a single SSM parameter value',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true },
      { id: 'name', label: 'Parameter Name', type: 'text', required: true, placeholder: '/my-app/db/url' },
      { id: 'decrypt', label: 'With decryption (for SecureString)', type: 'checkbox', default: true },
    ],
    generate: ({ profile, name, decrypt }) => {
      let cmd = `aws --profile ${profile} ssm get-parameter --name "${name}"`
      if (decrypt) cmd += ' --with-decryption'
      return cmd
    },
  },

  {
    id: 'ssm-get-path',
    category: 'SSM Parameters',
    name: 'Get by Path',
    description: 'Retrieve all parameters under a path prefix',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true },
      { id: 'path', label: 'Path', type: 'text', required: true, placeholder: '/my-app/' },
      { id: 'recursive', label: 'Recursive', type: 'checkbox', default: true },
      { id: 'decrypt', label: 'With decryption', type: 'checkbox', default: true },
    ],
    generate: ({ profile, path, recursive, decrypt }) => {
      let cmd = `aws --profile ${profile} ssm get-parameters-by-path --path "${path}"`
      if (recursive) cmd += ' --recursive'
      if (decrypt) cmd += ' --with-decryption'
      return cmd
    },
  },

  {
    id: 'ssm-delete',
    category: 'SSM Parameters',
    name: 'Delete Parameter',
    description: 'Permanently delete an SSM parameter',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true },
      { id: 'name', label: 'Parameter Name', type: 'text', required: true, placeholder: '/my-app/db/url' },
    ],
    generate: ({ profile, name }) =>
      `aws --profile ${profile} ssm delete-parameter --name "${name}"`,
  },

  {
    id: 'ecr-login',
    category: 'ECR',
    name: 'Docker Login',
    description: 'Authenticate Docker with your ECR registry',
    fields: [
      { id: 'profile', label: 'Profile', type: 'profile', required: true },
      { id: 'accountId', label: 'AWS Account ID', type: 'text', required: true, placeholder: '123456789012' },
      { id: 'region', label: 'Region', type: 'text', required: true, placeholder: 'ap-southeast-2' },
    ],
    generate: ({ profile, accountId, region }) =>
      `aws --profile ${profile} ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${accountId}.dkr.ecr.${region}.amazonaws.com`,
  },
]
