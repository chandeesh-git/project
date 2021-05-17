'use strict';

var sql_conn = require('../../db/sequelize_models');
const { sequelize } = require('../../db/sequelize_models/index');
const { Sequelize, Op, HasMany } = require("sequelize");
const { roleModel, groupModel } = require('../../db/sequelize_models');
// const sequelize = new Sequelize("mysql::memory:");
const { QueryTypes } = require("sequelize");

const userGroupDatails = { 
    addUsersToGroup: async (data) => {
		return sql_conn.userGroupModel.create(data).catch(console.error);
    },
    editUserGroup: async data => {
      return sql_conn.userGroupModel.update(data,{
        where: {
          'id': data.id
        }
      }).catch(console.error);
    },

    // deleteUserGroup: async data => {
    //   return sql_conn.userGroupModel.destroy({
    //     where: {
    //       'id': data.id
    //     }
    //   }).catch(console.error);
    // },

    deleteUserGroup: async data => {
      return sql_conn.userGroupModel.update({
        'is_active':false
      },{
        where: {
          'id': data.id
        }
      }).catch(console.error);
    },

    fetchGroupId: async(data) => {
      let result;
      const query = `SELECT group_concat(id) as id FROM groups where project_id=${data.project_id} and domain_id="${data.domain_id}" `
      result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      return result;
    },

    fetchUserListGroup: async group_ids => {
      let result;
        const sql_statement = `
        SELECT id,user_name,group_id,jira_acct_id FROM user_group where group_id in(${group_ids})`
        result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result
      },

      fetchUserListActiveGroup: async group_ids => {
        let result;
          const sql_statement = `
          SELECT id,user_name,group_id,jira_acct_id FROM user_group where group_id in(${group_ids}) and is_active = 1`
          result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
          return result
      },

    userGroupRoleList: async jira_acct_id => {
     const  userGroupRoleList = await sql_conn.sequelize.query('SELECT * FROM user_group  AS user_group INNER JOIN groups AS groups ON user_group.group_id = groups.id  AND groups.role_id IS NOT NULL LEFT OUTER JOIN roles ON groups.role_id = roles.id WHERE user_group.jira_acct_id =:jira_acct_id', {
        replacements: {jira_acct_id},
        type: QueryTypes.SELECT
      });
      return userGroupRoleList;
    },
    // //bulk insert user group values 
    // insertUserGroupsAppSetup: async (userGroups) => {
    //   console.log("data userGroups==>",userGroups);
    //   console.log("DATA = "+JSON.stringify(userGroups));
    //   return sql_conn.userGroupModel.bulkCreate(userGroups,{
    //     updateOnDuplicate: ['project_id', 'domain_id']
    //   }).catch(console.error);
    // },
}

module.exports = { userGroupDatails }