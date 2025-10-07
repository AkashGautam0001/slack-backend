import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorspace } from './workspaceService.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Channel not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    console.log('channel', channel, userId);

    const isUserPartOfWorkspace = isUserMemberOfWorspace(
      channel.workspaceId,
      userId
    );

    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        explaination:
          'User is not a member of the workspace and can not access the channel',
        message: 'User is not a member of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return channel;
  } catch (error) {
    console.log('Get channel by id service error', error);
    throw error;
  }
};
