const versionService = require('./version.service');

class VersionController {
  async getVersions(req, res, next) {
    try {
      const data = await versionService.getVersions(req.query);

      return res.status(200).json({
        success: true,
        message: 'Versions fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVersionById(req, res, next) {
    try {
      const data = await versionService.getVersionById(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Version fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createVersion(req, res, next) {
    try {
      const data = await versionService.createVersion(req.body);

      return res.status(201).json({
        success: true,
        message: 'Version created successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateVersion(req, res, next) {
    try {
      const data = await versionService.updateVersion(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Version updated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteVersion(req, res, next) {
    try {
      const data = await versionService.deleteVersion(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Version deleted successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VersionController();