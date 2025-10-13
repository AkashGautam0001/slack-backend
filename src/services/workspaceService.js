import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addEmailtoMailQueue } from '../producers/mailQueueProducers.js';
import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { workspaceJoinMail } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

const isUserAdminOfWorkspace = (workspace, userId) => {
  console.log('Workspace', workspace.members[0].memberId, userId);
  return workspace.members.find(
    (member) =>
      (member.memberId.toString() ||
        member.memberId._id.toString() === userId) &&
      member.role === 'admin'
  );
};

export const isUserMemberOfWorspace = (workspace, memberId) => {
  return workspace.members.find(
    (member) => member.memberId.toString() === memberId
  );
};

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
  return workspace.channels.find(
    (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
  );
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();

    console.log('Workspace Data', workspaceData);

    const response = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      response._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError({ error: error.errors }, error.message);
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['A workspace with same details already exists']
        },
        'A workspace with same details already exists'
      );
    }
  }
};

export const getWorkspacesUserIsMembersOfService = async (userId) => {
  try {
    const response =
      await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log('Get Workspace user is member of service error', error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }
    const isAllowed = isUserAdminOfWorkspace(workspace, userId);

    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);
      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      explaination:
        'User is either not a member or an admin for the delete workspace',
      message: 'User is not allowed to delete the workspace',
      StatusCode: StatusCodes.UNAUTHORIZED
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }
    const isMember = isUserMemberOfWorspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explaination: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }
    return workspace;
  } catch (error) {
    console.log('Get workspace service error', error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceByJoinCode(joinCode);

    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explaination: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('Get workspace by join code service error', error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if (!isAdmin) {
      throw new ClientError({
        explaination: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('Update workspace service error', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if (!isAdmin) {
      throw new ClientError({
        explaination: 'User is not a admin of the workspace',
        message: 'User is not a admin of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);
    if (!isValidUser) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'User not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isUserMemberOfWorspace(workspace, memberId);

    if (isMember) {
      throw new ClientError({
        explaination: 'User is already a member of the workspace',
        message: 'User is not a member of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addEmailtoMailQueue({
      ...workspaceJoinMail(workspace.name),
      to: isValidUser.email
    });

    return response;
  } catch (error) {
    console.log('Add member to workspace service error', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace =
      await workspaceRepository.getWorkspaceDetailsById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explaination: 'Invalid data sent from the client',
        message: 'Workspace not found',
        StatusCode: StatusCodes.NOT_FOUND
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    console.log('isAdmin', isAdmin);

    if (!isAdmin) {
      throw new ClientError({
        explaination: 'User is not a Admin of the workspace',
        message: 'User is not a Admin of the workspace',
        StatusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isChannelAlready = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );

    if (isChannelAlready) {
      throw new ClientError({
        explaination: 'Invalid data sent from client',
        message: 'Channel already part of workspace',
        StatusCode: StatusCodes.FORBIDDEN
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return response;
  } catch (error) {
    console.log('Add channel to workspace service error', error);
    throw error;
  }
};
