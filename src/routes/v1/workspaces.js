import express from 'express';
import { validate } from '../../validators/zodValidator.js';
import {
  addChannelToWorkspaceSchema,
  addMemberToWorkspaceSchema,
  workspaceSchema
} from '../../validators/workspaceSchema.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';
import {
  addChannelToWorkspaceController,
  addMemberToWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspacesUserIsMembersOfController,
  updateWorkspaceController
} from '../../controllers/workspaceContoller.js';
import { addChannelToWorkspaceService } from '../../services/workspaceService.js';

const router = express.Router();

router.post(
  '/',
  isAuthenticated,
  validate(workspaceSchema),
  createWorkspaceController
);
router.get('/', isAuthenticated, getWorkspacesUserIsMembersOfController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController);
router.get(
  '/join/:joinCode',
  isAuthenticated,
  getWorkspaceByJoinCodeController
);
router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);
router.put(
  '/:workspaceId/members',
  validate(addMemberToWorkspaceSchema),
  isAuthenticated,
  addMemberToWorkspaceController
);
router.put(
  '/:workspaceId/channels',
  validate(addChannelToWorkspaceSchema),
  isAuthenticated,
  addChannelToWorkspaceController
);

export default router;
