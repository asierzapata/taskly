# Taskly

This is a note taking desktop app that works with local markdown files. All the features are developed with the local first mindset.

Theres also some tests I made for using the same local first experience on the web.

## Run the app

First make sure you have the dependencies installed. It uses yarn workspaces so you can install all the dependencies by running:

```bash
yarn
```

### Development

From the root folder run:

```bash
yarn dev:desktop
```

### Create an executable

From the root folder run:

```bash
yarn workspace @taskly/desktop app:make
```
