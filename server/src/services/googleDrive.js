const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');

/**
 * Google Drive Service
 * Note: Requires OAUTH2 credentials in .env
 */
class GoogleDriveService {
    constructor() {
        this.drive = null;
        this.folderName = 'PT Fitness Reports';
    }

    async authenticate() {
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
            console.log('Google Drive credentials missing. Using local storage fallback.');
            this.drive = null;
            return;
        }

        try {
            const auth = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI
            );

            auth.setCredentials({
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN
            });

            this.drive = google.drive({ version: 'v3', auth });
            console.log('Google Drive initialized');
        } catch (error) {
            console.error('Google Drive initialization failed:', error.message);
            // Fallback to local storage if initialization fails
            this.drive = null;
        }
    }

    async getOrCreateFolder() {
        if (!this.drive) return null;

        try {
            const response = await this.drive.files.list({
                q: `name = '${this.folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name)',
            });

            if (response.data.files.length > 0) {
                return response.data.files[0].id;
            }

            const folderMetadata = {
                name: this.folderName,
                mimeType: 'application/vnd.google-apps.folder',
            };

            const folder = await this.drive.files.create({
                resource: folderMetadata,
                fields: 'id',
            });

            return folder.data.id;
        } catch (error) {
            console.error('Error getting/creating folder:', error.message);
            return null;
        }
    }

    async uploadReport(clientName, pdfBuffer) {
        if (!this.drive) {
            // Local fallback
            const filename = `${clientName.replace(/\s+/g, '_')}_FitnessReport_${new Date().toISOString().split('T')[0]}.pdf`;
            const localPath = path.resolve(__dirname, '../../reports', filename);

            if (!fs.existsSync(path.dirname(localPath))) {
                fs.mkdirSync(path.dirname(localPath), { recursive: true });
            }

            fs.writeFileSync(localPath, pdfBuffer);
            console.log(`Report saved locally: ${localPath}`);
            return { localPath, webViewLink: '#' };
        }

        try {
            const folderId = await this.getOrCreateFolder();
            const filename = `${clientName.replace(/\s+/g, '_')}_FitnessReport_${new Date().toISOString().split('T')[0]}.pdf`;

            const fileMetadata = {
                name: filename,
                parents: folderId ? [folderId] : [],
            };

            const media = {
                mimeType: 'application/pdf',
                body: Readable.from(pdfBuffer),
            };

            const response = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id, webViewLink',
            });

            console.log('Report uploaded to Google Drive:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('Error uploading to Google Drive:', error.message);
            throw error;
        }
    }
}

module.exports = new GoogleDriveService();
