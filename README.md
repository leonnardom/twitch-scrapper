# Twitch Tracker Scraper

This project is a scraper for Twitch Tracker, developed with Node.js and TypeScript, using Puppeteer for browser automation. The scraper collects information about peak viewers and average viewers from Twitch Tracker profiles.

## Features

- **Twitch Data Collection:** Retrieves peak viewers and average viewers from Twitch Tracker profiles.
- **Simulated Interaction:** Simulates user interaction with the page to avoid bot detection.
- **Captcha Handling:** Uses the reCAPTCHA plugin to handle captchas automatically.

## Requirements

- Node.js (v14 or higher)
- TypeScript
- `ts-node` (for running TypeScript code directly)
- `puppeteer-extra`, `puppeteer`, `puppeteer-extra-plugin-stealth`, and `puppeteer-extra-plugin-recaptcha` (for browser automation and captcha handling)
- `PORT` environment variable (optional)

## Installation

Clone the repository and install the dependencies:

    git clone https://github.com/leonnardom/twitch-scrapper.git
    cd twitch-scrapper
    npm install

## Running the Project

To run the project directly in TypeScript, use the following command:

    npx ts-node src/index.ts

For a development environment with automatic reloading, install `ts-node-dev` and run:

    npm run dev

## Available Scripts

- `start`: Runs the TypeScript code using `ts-node`.
- `dev`: Runs the TypeScript code with `ts-node-dev` for development.

## API Usage

Send a POST request to the `/scrape` endpoint with a JSON body containing the Twitch Tracker URL you want to collect information from:

    POST http://localhost:3000/scrape
    Content-Type: application/json

```typescript
    {
      "url": "https://twitchtracker.com/username"
    }
```

### Example Request

    POST http://localhost:3000/scrape
    Content-Type: application/json

```typescript
    {
      "url": "https://twitchtracker.com/loud_coringa"
    }
```

### Example Response

```json
{
  "success": true,
  "data": {
    "week": {
      "peakViewers": 12345,
      "averageViewers": 6789
    },
    "month": {
      "peakViewers": 23456,
      "averageViewers": 7890
    },
    "3 months": {
      "peakViewers": 34567,
      "averageViewers": 8901
    }
  }
}
```

The response will include the peak viewers and average viewers for different periods (week, month, 3 months) for the specified Twitch Tracker profile.

## Contributing

Contributions are welcome! If you wish to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).

## Data Source

The data is sourced from [Twitch Tracker](https://twitchtracker.com). Example profile: [https://twitchtracker.com/loud_coringa](https://twitchtracker.com/loud_coringa)
