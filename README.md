# AWS Command Generator

A clean, fast web UI for generating AWS CLI commands without memorizing syntax. Stop looking up `aws ssm put-parameter` flags — just fill in a form and copy.

**Features:**
- ⚡ Zero-config form-based AWS command builder
- 💾 Remembers your recently used profiles (stored locally)
- 🎨 Beautiful terminal output with syntax highlighting
- ⌨️ One-click copy to clipboard
- 🚀 Lightweight, no backend needed

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5174](http://localhost:5174)

## Using the App

1. **Pick a command** from the sidebar (SSO Login, SSM Put Parameter, etc.)
2. **Fill in the form** — your profile, parameter name, value, etc.
3. **See the command preview** update in real-time in the terminal below
4. **Copy** when all required fields are filled
5. **Your profile gets saved** to recently-used for next time

## Adding New Commands

Add commands to [`src/commands.js`](src/commands.js). Each command is a simple object:

```javascript
{
  id: 'unique-id',
  category: 'Category Name',          // Groups in sidebar
  name: 'Human Readable Name',
  description: 'What this does',
  fields: [
    { id: 'profile', label: 'Profile', type: 'profile', required: true, placeholder: 'dt-dev' },
    { id: 'name', label: 'Parameter Name', type: 'text', required: true, placeholder: '/app/db/url' },
    { id: 'value', label: 'Value', type: 'textarea', required: true },
    {
      id: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      default: 'String',
      options: [
        { value: 'String', label: 'String' },
        { value: 'SecureString', label: 'SecureString' },
      ],
    },
    { id: 'flag', label: 'Some flag', type: 'checkbox', default: false },
  ],
  generate: ({ profile, name, value, type, flag }) => {
    let cmd = `aws --profile ${profile} ssm put-parameter --name "${name}" --value "${value}" --type ${type}`
    if (flag) cmd += ' --some-flag'
    return cmd
  },
}
```

**Field types:** `profile` | `text` | `textarea` | `select` | `checkbox`

**The `generate` function** receives an object with all field values and should return the complete command string. Unfilled required fields appear as `<Field Label>` placeholders in the preview.

## Structure

```
src/
├── App.jsx                 # Main layout + command routing
├── App.css                 # All styles (dark sidebar, terminal, etc.)
├── commands.js             # Command definitions
├── useProfiles.js          # localStorage hook for recent profiles
├── components/
│   ├── CommandSidebar.jsx  # Left sidebar with command list
│   ├── CommandForm.jsx     # Form renderer + terminal output + syntax highlighting
│   └── ProfileInput.jsx    # Smart profile dropdown
└── main.jsx               # React entry point
```

## Built With

- **React 18** — UI
- **Vite** — Lightning-fast dev & build
- **CSS** — All styling (no frameworks)

## Deployment

```bash
npm run build
```

Output is in `dist/`. Deploy anywhere that serves static files:
- Vercel: `vercel deploy`
- Netlify: `netlify deploy --prod --dir dist`
- Any S3/CloudFront setup

## Profiles & History

Recently-used profiles are stored in browser localStorage under the key `aws-gen-recent-profiles`. Clearing browser data will reset them.

To back up profiles: open DevTools → Application → Local Storage → copy the value.

## Next Ideas

- **Command history** — undo/redo your last 20 generated commands
- **Shareable links** — encode form state in URL to share with teammates
- **Custom commands** — UI to define your own command templates
- **Multi-command chains** — group related commands (SSO login → ECR login)
- **AWS config reader** — auto-detect profiles from `~/.aws/config` (local/Electron version)

## License

MIT
