import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    docs: {
      toc: true, // Enable table of contents
      source: {
        state: 'open', // Show source code by default
      },
    },
    layout: 'centered',
  },
};

export default preview;
