# SampleAPIs - Product Requirements Document (PRD)

## 1. Introduction

### 1.1 Purpose

SampleAPIs is an educational platform providing a collection of RESTful API endpoints for developers to learn and experiment with API interactions. The service offers various endpoints with full CRUD capabilities, making it an ideal sandbox for learning API development and testing.

### 1.2 Target Audience

- Junior developers learning API development
- Students studying RESTful API concepts
- Developers testing API integration
- Educators teaching API development
- Anyone interested in experimenting with API endpoints

## 2. Product Overview

### 2.1 Product Description

SampleAPIs provides a collection of themed RESTful API endpoints that developers can use to learn and experiment with API interactions. Each endpoint offers full CRUD capabilities and follows RESTful design principles.

### 2.2 Key Features

- Multiple themed endpoints (e.g., Futurama, Movies, etc.)
- Full CRUD operations support
- Search functionality across endpoints
- Query parameter support
- No authentication required
- Free to use

## 3. Functional Requirements

### 3.1 API Endpoints

- JSON-Server based RESTful architecture
- JSON response format
- HTTP methods support (GET, POST, PUT, DELETE)
- Query parameter filtering
- CORS enabled

### 3.2 Data Management

- Weekly data reset to maintain consistency
- Persistent data through pull requests
- Educational data sets
- No sensitive or production data

### 3.3 Developer Experience

- Simple and intuitive API structure
- Clear documentation
- Example code snippets
- No authentication required

## 4. Non-Functional Requirements

### 4.1 Performance

- Response time < 500ms
- 99.9% uptime
- Weekly data reset
- Basic rate limiting

### 4.2 Security

- No authentication required
- CORS enabled
- Input validation
- Basic rate limiting
- No sensitive data storage

### 4.3 Reliability

- Regular data backups
- Weekly data reset
- Error handling
- Health monitoring

## 5. Technical Specifications

### 5.1 API Structure

```javascript
// Example: Fetching Futurama characters
const baseURL = "https://api.sampleapis.com/futurama/characters";
fetch(baseURL)
  .then((resp) => resp.json())
  .then((data) => console.log(data));

// Example: Searching for specific character
fetch(`${baseURL}?name.first=Bender`)
  .then((resp) => resp.json())
  .then((data) => console.log(data));
```

### 5.2 Response Format

```json
{
  "data": [
    {
      "id": 1,
      "name": "Example"
    }
  ]
}
```

### 5.3 Error Codes

- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## 6. Constraints and Limitations

### 6.1 Technical Constraints

- JSON-Server limitations
- Basic rate limiting
- Weekly data reset

### 6.2 Usage Limitations

- Educational use only
- No sensitive data
- No authentication
- Basic rate limiting

## 7. Success Criteria

### 7.1 Performance Metrics

- Response time < 500ms
- 99.9% uptime
- Error rate < 1%

### 7.2 Usage Metrics

- Number of active users
- Number of successful CRUD operations
- User feedback and satisfaction
- Number of contributions

## 8. Maintenance and Support

### 8.1 Regular Maintenance

- Weekly data reset
- Security updates
- Performance optimization
- Documentation updates
- Bug fixes

### 8.2 Support Channels

- GitHub Issues
- Documentation
- Community contributions
- Code of Conduct enforcement

## 9. Legal and Compliance

### 9.1 Terms of Service

- Educational use only
- No warranty
- Data ownership
- Usage limitations
- Liability disclaimers

### 9.2 Data Privacy

- No personal data collection
- No sensitive information
- Data reset policy
- Usage tracking policy

## 10. References

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [JSON-Server Documentation](https://github.com/typicode/json-server)
