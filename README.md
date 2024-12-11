# Diablo Web Simple

![App Screenshot](./public/screenshot.png)

This project is a simplified, web-based port of the original Diablo game, making it easier to run on your own server or hosting environment. The goal is to bring the classic Diablo experience to the browser using a modern tech stack, including Vite and TypeScript.

## Playing Diablo

To play the **full game**, you must use your own **`DIABDAT.MPQ`** file obtained from an original copy of the game available on [GoG](https://www.gog.com/game/diablo).
You can only upload **`diabdat.mpq`**, and it **must be compressed** using the compression tool available at: [johnimril.github.io/diablo_web/](https://johnimril.github.io/diablo_web/).

### Deployment Instructions

**To run the game locally:**

1. Place the **compressed `diabdat.mpq`** file in the `public` folder.
2. Start the development server as described below.

**To deploy the game on your own server:**

1. **Compress `diabdat.mpq`:**  
   Use the compression tool available at [johnimril.github.io/diablo_web/](https://johnimril.github.io/diablo_web/) to reduce the file size.

2. **Prepare the build:**  
   Generate the production build of your project (e.g., using `npm run build`).

3. **Upload files to your server:**  
   - Upload the **build files** to your server in the `../diablo_web_simple/` directory.  
   - Upload the **compressed `diabdat.mpq`** file to the same `../diablo_web_simple/` directory.

4. **Verify paths:**  
   Ensure that the build and `diabdat.mpq` are accessible at the correct paths.

## About the Project

This project was initially based on the [DiabloWeb](https://github.com/d07RiV/diabloweb) repository by d07RiV. The code has been modified to remove unnecessary dependencies and to expose a minimal JavaScript interface, enabling the game to be compiled into WebAssembly. [My optimized project](https://github.com/JohnImril/diablo_web)

Significant changes were made to event handling—particularly in the menus—to adapt to the browser-based, JavaScript-driven environment.

This project also builds on the work of [devilution](https://github.com/diasurgical/devilution), which was crucial in making Diablo 1 playable in web browsers through WebAssembly. The source code used to build the WebAssembly modules can be found [here](https://github.com/d07RiV/devilution).

## Features

- **Vite Build System**: Enjoy faster and more efficient development with Vite.
- **TypeScript**: Strong typing for improved maintainability and reduced bugs.
- **Modernized Codebase**: Updated dependencies and refactored code for better performance and reliability.
- **Compatible with Node 22**: Resolved issues that prevented the project from running on Node 22.

## Getting Started

### Prerequisites

- Node.js (v22 or later)
- npm

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JohnImril/diablo_web_simple.git
    ```

2. Navigate to the project directory:

    ```bash
    cd diablo_web_simple
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Project Locally

1. Place your `diabdat.mpq` (full game) in the `public` folder.
2. Start the development server:

    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173/diablo_web_simple/`.

### Building for Production

To build the project for a production environment:

```bash
npm run build
```

## Deploying on Your Own Server

To deploy the game on your own server:

1. Build the project for production as described above.
2. Upload the contents of the `dist/` directory to your hosting environment.
3. Ensure that `diabdat.mpq` is placed in the correct location (e.g., the same directory as `index.html` in `dist/`).
4. Access the site through your server’s URL. You can now play Diablo directly from your own hosted environment.

## Contributing

Contributions are welcome! If you encounter any issues, feel free to open an issue or submit a pull request.

## Acknowledgements

Special thanks to [d07RiV](https://github.com/d07RiV) for the original DiabloWeb project, which laid the groundwork for this project. Additionally, we extend our gratitude to the [devilution](https://github.com/diasurgical/devilution) team for their incredible work in making Diablo 1 accessible on modern platforms.
