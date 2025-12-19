# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in FREEZLET, please report it responsibly.

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email the maintainer at: gary938@users.noreply.github.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response time**: Within 48 hours
- **Resolution**: We aim to release patches within 7 days for critical issues
- **Credit**: We will acknowledge your contribution (unless you prefer anonymity)

## Security Measures

FREEZLET implements the following security measures:

### Electron Security
- `sandbox: true` - Renderer process isolation
- `contextIsolation: true` - Secure context bridge
- `nodeIntegration: false` - No direct Node.js access from renderer
- Whitelisted IPC channels only

### Content Security Policy
```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
```

### Data Protection
- All data stored locally on user's machine
- No external network requests
- No telemetry or tracking
- SQLite database with user data only

## Best Practices for Users

1. Download FREEZLET only from official sources (GitHub Releases)
2. Keep the application updated
3. Do not run the application with elevated privileges
4. Report any suspicious behavior

## Acknowledgments

We appreciate the security research community's efforts in making FREEZLET safer.
