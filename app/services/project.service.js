const mssql = require("../../mssql");
const TYPES = require("tedious").TYPES;

const getAll = async loginId => {
  try {
    const response = await mssql.executeProc(
      "Project_SelectAll",
      sqlRequest => {
        sqlRequest.addParameter("LoginId", TYPES.Int, loginId);
      }
    );
    return response.resultSets[0];
  } catch (err) {
    console.log(err);
  }
};

const getById = async (loginId, id) => {
  try {
    const response = await mssql.executeProc(
      "Project_SelectById",
      sqlRequest => {
        sqlRequest.addParameter("LoginId", TYPES.Int, loginId);
        sqlRequest.addParameter("Id", TYPES.Int, id);
      }
    );
    if (
      response.resultSets &&
      response.resultSets[0] &&
      response.resultSets[0].length > 0
    ) {
      return response.resultSets[0][0];
    } else {
      return null;
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const post = async item => {
  try {
    const response = await mssql.executeProc("Project_Insert", sqlRequest => {
      sqlRequest.addParameter("name", TYPES.NVarChar, item.name, {
        length: 200
      });
      sqlRequest.addParameter("address", TYPES.NVarChar, item.address, {
        length: 200
      });
      sqlRequest.addParameter("description", TYPES.NVarChar, item.description, {
        length: Infinity
      });
      sqlRequest.addParameter("formInputs", TYPES.NVarChar, item.formInputs, {
        length: Infinity
      });
      sqlRequest.addParameter("loginId", TYPES.Int, item.loginId);
      sqlRequest.addParameter("calculationId", TYPES.Int, item.calculationId);
      sqlRequest.addOutputParameter("id", TYPES.Int, null);
    });
    return response.outputParameters;
  } catch (err) {
    return Promise.reject(err);
  }
};

const put = async item => {
  try {
    await mssql.executeProc("Project_Update", sqlRequest => {
      sqlRequest.addParameter("name", TYPES.NVarChar, item.name, {
        length: 200
      });
      sqlRequest.addParameter("address", TYPES.NVarChar, item.address, {
        length: 200
      });
      sqlRequest.addParameter("description", TYPES.NVarChar, item.description, {
        length: Infinity
      });
      sqlRequest.addParameter("formInputs", TYPES.NVarChar, item.formInputs, {
        length: Infinity
      });
      sqlRequest.addParameter("loginId", TYPES.Int, item.loginId);
      sqlRequest.addParameter("calculationId", TYPES.Int, item.calculationId);
      sqlRequest.addParameter("id", TYPES.Int, item.id);
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

const del = async (loginId, id) => {
  try {
    await mssql.executeProc("Project_Delete", sqlRequest => {
      sqlRequest.addParameter("loginId", TYPES.Int, loginId);
      sqlRequest.addParameter("id", TYPES.Int, id);
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

const copy = async (loginId, projectId) => {
  try {
    await mssql.executeProc("Project_Copy", sqlRequest => {
      sqlRequest.addParameter("loginId", TYPES.Int, loginId);
      sqlRequest.addParameter("id", TYPES.Int, projectId);
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  getAll,
  getById,
  post,
  put,
  del,
  copy
};
