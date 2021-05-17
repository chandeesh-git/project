'use strict';

var sql_conn = require('../../db/sequelize_models');
const { sequelize } = require('../../db/sequelize_models/index');
const { Sequelize, Op, HasMany } = require("sequelize");
const { roleModel, groupModel } = require('../../db/sequelize_models');
// const sequelize = new Sequelize("mysql::memory:");
const { QueryTypes } = require("sequelize");

const userGroupDatails = { 
    addUsersToGroup: async (data) => {
		return sql_conn.globalUserGroupModel.create(data).catch(console.error);
    },
    editUserGroup: async data => {
      return sql_conn.globalUserGroupModel.update(data,{
        where: {
          'id': data.id
        }
      }).catch(console.error);
    },

    deleteUserGroup: async data => {
      return sql_conn.globalUserGroupModel.update({
        'is_active':false,
        'updated_by':data.acct_id
      },{
        where: {
          'id': data.id
        }
      }).catch(console.error);
    },

    fetchGroupId: async(data) => {
      let result;
      const query = `SELECT group_concat(id) as id FROM global_groups where domain_id="${data.domain_id}" `
      result = sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      return result;
    },

    fetchUserListGroup: async group_ids => {
      let result;
        const sql_statement = `
        SELECT id,user_name,group_id,jira_acct_id FROM global_user_group where group_id in(${group_ids})`
        result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
        return result
      },

      fetchUserListActiveGroup: async group_ids => {
        let result;
          const sql_statement = `
          SELECT id,user_name,group_id,jira_acct_id FROM global_user_group where group_id in(${group_ids}) and is_active = 1`
          result = sequelize.query(sql_statement, { type: sequelize.QueryTypes.SELECT })
          return result
      },

    userGroupRoleList: async jira_acct_id => {
     const  userGroupRoleList = await sql_conn.sequelize.query('SELECT * FROM global_user_group  AS user_group INNER JOIN global_groups AS groups ON user_group.group_id = groups.id  AND groups.role_id IS NOT NULL LEFT OUTER JOIN global_roles ON groups.role_id = roles.id WHERE user_group.jira_acct_id =:jira_acct_id', {
        replacements: {jira_acct_id},
        type: QueryTypes.SELECT
      });
      return userGroupRoleList;
    },

    // domainUserGroupList: async(data) => {
    //   let result;
    //   const query = `SELECT * FROM global_user_group where domain_id ="${data.domain_id}" and is_active=1 `
    //   result =  await sql_conn.sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
    //   return result;
    // },
}

module.exports = { userGroupDatails }