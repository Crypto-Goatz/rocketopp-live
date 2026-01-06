# Version Control Policy

## CRITICAL: Do Not Modify Without Approval

### Current Stable Versions
- **Next.js**: 16.0.10 (Patched for React2Shell CVE)
- **Node.js**: 24.x
- **React**: 19.2.0

### Version Change Policy

**⚠️ IMPORTANT: These versions are locked and must NOT be changed without explicit approval from v0 development team.**

These versions have been carefully selected and patched for:
- Security vulnerabilities (React2Shell CVE-2025-55182/CVE-2025-66478)
- Stability and compatibility
- Performance optimization
- Feature requirements

### Before Making Any Version Changes

1. Consult with v0 development team
2. Document the reason for the change
3. Test thoroughly in a separate branch
4. Get explicit approval before merging

### Deployment Notes

- All deployments use the locked versions specified above
- Automated dependency updates are disabled for core framework packages
- Security patches will be applied manually after review

### Environment Variables

The following environment variables are required for the inquiry and assessment system:

- **NEXT_PUBLIC_INQUIRY_WEBHOOK_URL**: Webhook URL for receiving inquiry form submissions
- **NEXT_PUBLIC_ASSESSMENT_WEBHOOK_URL**: Webhook URL for receiving assessment timeline data

The following environment variable is required for the personalization system:

- **NEXT_PUBLIC_PERSONALIZATION_WEBHOOK_URL**: Webhook URL for n8n personalization data and automated marketing campaigns

These variables should be configured in the Vercel project settings or local `.env.local` file.

---

**Last Updated**: December 2025
**Maintained By**: RocketOpp Development Team
