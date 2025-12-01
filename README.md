# CSE 110 Math Magic

A web-based educational board game built with TypeScript, Vite, and Konva. Players roll dice to move across a game board, landing on different tiles that trigger questions, minigames, and challenges.

## Features

### Main Game Board
- **40-tile board game** with various node types:
  - Start/End tiles
  - Question tiles (Easy, Medium, Hard)
  - Minigame tiles
- **Dice rolling mechanics** with visual animations
- **Player piece movement** with smooth animations
- **Game completion** with end screen

### Minigames
- **Wizard Game**: Action-based combat minigame
- **Among Us Game**: Puzzle-solving minigame

### Screens
- **Starting Screen**: Game introduction
- **Home Screen**: Main menu
- **Settings Screen**: Game configuration
- **Main Game Screen**: Core board game experience
- **Math Screen**: Quadratic equation solving
- **Linear Screen**: Linear equation solving during Wizard minigame

### Audio System
- Background music for different screens
- Sound effects for interactions
- Audio controller for managing game audio

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CSE110-Coblenz/cse-110-project-team-9.git
cd cse-110-project-team-9
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Building for Production

Build the application:
```bash
npm run build
```

## Testing

Run all tests:
```bash
npm test
```

The project uses **Vitest** for unit testing with comprehensive test coverage for:
- Controllers (MainGameScreen, HomeScreen, SettingsScreen, etc.)
- Models (Game models, Audio models)
- Game logic (Collision detection, Enemy management, Player models)

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── constants.ts            # Game constants
├── types.ts                # TypeScript type definitions
├── audios/                 # Audio management
│   ├── AudioController.ts
│   └── AudioModel.ts
├── screens/                # Game screens
│   ├── StartingScreen/     # Introduction screen
│   ├── HomeScreen/         # Main menu
│   ├── SettingsScreen/     # Settings
│   ├── MainGameScreen/     # Main board game
│   ├── WizardGameScreen/   # Wizard minigame
│   ├── AmongUsGameScreen/  # Among Us minigame
|   ├── MathScreen/         # Quadratic equation game
│   └── LinearScreen/       # Linear equation screen
└── tests/                  # Tests
    ├── MainGameScreen/
    ├── WizardGame/
    ├── AmongUsGame/
    └── ...
```

## Technologies

- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Konva**: 2D canvas library for game graphics
- **Vitest**: Unit testing framework
- **GitHub Actions**: CI/CD pipeline

## Game Mechanics

### Board Game Flow
1. Player starts at position 0 (Start tile)
2. Player rolls dice (1-6)
3. Player moves forward by the dice value
4. Landing on different tiles triggers events:
   - **Question tiles**: Display questions
   - **Minigame tiles**: Launch random minigame (Wizard or Among Us)
   - **End tile**: Complete game and show completion screen
5. Game ends when player reaches the final tile (position 39)

## Links

- Repository: [GitHub](https://github.com/CSE110-Coblenz/cse-110-project-team-9)
- Issues: [GitHub Issues](https://github.com/CSE110-Coblenz/cse-110-project-team-9/issues)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
