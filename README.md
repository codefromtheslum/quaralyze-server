## Quaralyze

Quarlyze is a dynamic platform where intellectuals come together to engate in meaningful and fact-based arguments. This space fosters constructive debates, sharpens analytical thinking, and promotes the exchange of diverse perspectives on various topics.

#### Features

- Topic posting: use the platform to post though-provoking topics for discussion.
- Intellectigent Arguments: encourage fact-driven and respectful debates.
- Rating System: reward well-reasoned arguments and contributions.
- Community Moderation: ensure healthy discussions through community oversight.

#### Technologies

- Frontend: React/NextJs for an interactive user interface.
- Backend: NodeJs/Express for API handling.
- Database: MongoDB for scalable data storage.
- Authentication: secure user authentication with OAuth && JWT
- Real-Time Updates: WebSockets for live debates and notifications.

#### Getting Started

##### Prerequisites

- NodeJs and npm/yarn
- MongoDB
- A code editor (e.g., VS Code)

#### Installation

1. Clone the repository:

```bash
git clone https://github.com/codefromtheslum/quaralyze-server
```

2. Navigate to the project directory:

```bash
cd quaralyze-server
```

3. Install dependencies: 
```bash
npm install
```

4. Set up an environment variables in a ``.env`` file: 
```javascript
MONGO_STRING = your_database_url
PORT = your_server_port

```

5. Start the development server:
```bash
npm run dev
```

#### Usage
- Create an account and login. 
- Update your profile in the settings to ensure transparency.
- Post a topic or join an ongoing argument.
- Share your opinions and debate intelligently.
- Rate and review contributions.

#### Contribution

Contributions are welcome! Here's how you can help: 
1. Fork the repository
2. Create a branch: 
```bash
git checkout -b feature-name
```
3. Make your changes and commit: 
```bash
git commit -m "Add your message here"
```
4. Push your branch: 
```bash
git push origin feature-name
```

### License
This project is licensed under the MIT License