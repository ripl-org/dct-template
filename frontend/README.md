# DCT - Frontend

## Prerequisites

1. Node.js >=18.17.0
2. Npm >=9.0.0

### Node Version

This project uses Node.js v18. It is recommended to use nvm to manage your Node.js versions. To install nvm, follow the instructions on the [nvm repository](https://github.com/nvm-sh/nvm). Once nvm is installed, you can run the following command to switch to the required version:

```sh
nvm install 18
nvm use 18
```

If you are using a Windows machine without WSL, follow the instructions on the [nvm-windows repository](https://github.com/coreybutler/nvm-windows).

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies using npm

```sh
git clone https://github.com/ripl-org/dct-template.git
cd dct-template/frontend
npm install
```

### Setup Environment Variables

To define environment variables create a `.env.local` file in the root of your project. You can use the `.env.local.example` file in the repository as a template for `.env.local` before adding the actual values to it.

Or you can run the following command:

```sh
cp .env.local.example .env.local
```

For Windows:

```powershell
copy .env.local.example .env.local
```

## Usage

### Development

To start the development server:

```sh
npm run dev
```

### Build (only needed for production or specific testing)

To build and export the Next.js app:

```sh
npm run build
```

To serve the exported app (Production-like):

```sh
npx serve@latest out
```

### Scripts: Type-check, Linting, Formating, and, Testing

Check for type errors:

```sh
npm run type-check
```

Check for linting errors and warnings:

```sh
npm run lint
```

Format code with prettier:

```sh
npm run format
```

Run test suite in all the codebase:

```sh
npm run test
```

Run tests only on changed files:

```sh
npm run test:watch
```

## Components

### Link (Next.js + MUI v5)

- `NextLinkComposed`: This component is unstyled and only responsible for handling the navigation. The prop href was renamed to to avoid a naming conflict. This is similar to react-router's Link component.

```jsx
import Button from '@mui/material/Button';
import { NextLinkComposed } from '@/components/Link';

export default function Index() {
  return (
    <Button component={NextLinkComposed} to="/about">
      Button link
    </Button>
  );
}
```

- `Link`: This component is styled. It uses the Material UI `Link` component with `NextLinkComposed`.

```jsx
import Link from '@/components/Link';

export default function Index() {
  return <Link href="/about">Link</Link>;
}
```

- `MuiLink`: If you simply need to provide a link to an external web page, you can use the Material UI `Link` component.

```jsx
import Link from '@mui/material/Link';

export default function Index() {
  return (
    <Link href="https://www.external-page-example.com/" rel="noopener" target="_blank">
      Go to external page
    </Link>
  );
}
```

More information: https://mui.com/material-ui/guides/routing/#next-js

## Analyze Bundle size

```bash
ANALYZE=true npm run build
```
