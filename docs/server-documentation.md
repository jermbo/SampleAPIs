# SampleAPIs Server Documentation

## Overview

SampleAPIs is a RESTful API server designed for learning and testing purposes. It provides a collection of sample APIs that can be used for development, testing, and educational purposes.

## Key Features

- RESTful API endpoints with JSON responses
- GraphQL support via json-graphql-server
- Rate limiting and request throttling
- CORS enabled for cross-origin requests
- Static file serving
- Pug template engine for views
- API list generation and management
- Reset functionality for testing
- Test API endpoints

## Technology Stack

- Node.js
- Express.js
- Pug (Template Engine)
- JSON Server
- JSON GraphQL Server
- Jest (Testing)

## Folder Structure

```
server/
├── api/            # API endpoint implementations
├── routes/         # Express route handlers
├── utils/          # Utility functions
├── views/          # Pug templates
├── public/         # Static assets
├── tests/          # Test files
├── sampleapis.js   # Main application file
├── apiList.js      # API list configuration
└── GeneratedAPIList.js # Generated API endpoints
```

## API Structure

The server provides several types of endpoints:

1. Base APIs - Core functionality endpoints
2. Test APIs - Endpoints for testing purposes
3. Custom APIs - User-created endpoints
4. GraphQL endpoints - GraphQL interface for the APIs

## Development Guidelines

### Code Style

- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for asynchronous operations
- Keep routes modular and organized

### API Design Principles

- RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Clear endpoint naming
- Version control for APIs

### Testing

- Write unit tests using Jest
- Test API endpoints
- Implement integration tests
- Follow TDD practices where applicable

### Security Considerations

- Rate limiting implemented
- CORS configuration
- Input validation
- Error handling
- Request throttling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Server

Development mode:

```bash
npm run server
```

Production mode:

```bash
npm start
```

### Testing

```bash
npm test
```

## API Documentation

### Base Endpoints

- `GET /` - Main page
- `GET /resetit` - Reset API state
- `POST /create` - Create new API endpoints
- `GET /generate` - Generate new API list
- `GET /test` - Test API endpoints

### Response Format

```json
{
  "response": 200,
  "data": {
    // Response data
  }
}
```

## Docker Support

The server includes Docker configuration for containerized deployment:

- Dockerfile for building the image
- docker-compose.yml for orchestration

## Contributing

Please refer to the CONTRIBUTING.md file for contribution guidelines.

## License

MIT License - See LICENSE file for details

## Best Practices

1. Keep routes modular and organized
2. Implement proper error handling
3. Use middleware for common functionality
4. Follow RESTful conventions
5. Write comprehensive tests
6. Document API changes
7. Use environment variables for configuration
8. Implement proper logging
9. Follow security best practices
10. Keep dependencies updated

## Common Issues and Solutions

1. CORS issues - Check CORS configuration
2. Rate limiting - Adjust rate limit settings
3. API generation - Clear cache and regenerate
4. Testing - Ensure proper test environment setup

## Performance Optimization

1. Use proper caching strategies
2. Implement request throttling
3. Optimize database queries
4. Use compression middleware
5. Implement proper error handling

## Monitoring and Logging

- Use Morgan for HTTP request logging
- Implement proper error logging
- Monitor API performance
- Track rate limiting and throttling

## Future Improvements

1. Enhanced GraphQL support
2. Improved documentation
3. Additional API endpoints
4. Better testing coverage
5. Performance optimizations
