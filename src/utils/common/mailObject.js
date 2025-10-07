import { MAIL_ID } from '../../config/serverConfig.js';

export const workspaceJoinMail = (workspaceName) => {
  return {
    from: MAIL_ID,
    subject: 'You have been added to workspace',
    text: `Congratulations! You have been added to the workspace ${workspaceName}`
  };
};
