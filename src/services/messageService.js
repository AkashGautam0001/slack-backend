import { StatusCodes } from 'http-status-codes';
import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorspace } from './workspaceService.js';

export const getMessagesService = async (messageParams, page, limit, user) => {
  const channelDetails = await channelRepository.getChannelWithWorkspaceDetails(
    messageParams.channelId
  );

  const workspace = channelDetails.workspaceId;

  const isMember = isUserMemberOfWorspace(workspace, user);

  if (!isMember) {
    throw new ClientError({
      explaination: 'User is not a member of the workspace',
      message: 'User is not a member of the workspace',
      StatusCode: StatusCodes.UNAUTHORIZED
    });
  }

  const messages = await messageRepository.getPaginatedMessages(
    messageParams,
    page,
    limit
  );
  return messages;
};

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message);
  return newMessage;
};
