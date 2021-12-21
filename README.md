# starter-ui
happ using invites and profiles zomes to get you starter on holochain development

the UI architecture template created with angular, is supposed and elegant modular and easy to understand  

## nix-shell setup

At first, run from the root folder of this repository to enter the nix-shell:

```bash
nix-shell
```

**You need to be inside this nix-shell to run any of the instructions below.**

From the root folder of the repo:

```bash
npm install
```

## Testing

```bash
npm test
```

## Starting the UI in mock mode

```bash
npm run start:mock
```

## Starting the UI to connect to holochain

```bash
npm start
```

## Starting a Holochain network

```bash
npm run start:build
npm run start:happ
npm run network 2
```

You can replace "2" by the number of agents that you want to boot up

<p align="center">
    <img src="architecture_multiplex.png" width="750">
</p>


