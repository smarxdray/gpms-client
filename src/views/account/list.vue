<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">{{ $t('permission.addAccount') }}</el-button>
    <el-table :data="userList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="学工号" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="姓名" width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column align="header-center" label="类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.role | roleFilter(roleList) }}</span>
          </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagFilter ">{{ scope.row.status | statusFilter(statusList)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >{{ $t('permission.editAccount') }}</el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >{{ $t('permission.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'Edit Account':'New Account'"
    >
      
      
    </el-dialog> -->
    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" 
    :title="dialogType==='edit'?'Edit Account':'New Account'"
     >
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Code">
          <el-input v-model="user.code" placeholder="Account phone"/>
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="user.role"  placeholder="Account role">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Phone" >
          <el-input v-model="user.phone" placeholder="Account phone" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" placeholder="Account email" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input v-model="user.desc" placeholder="Account desc" />
        </el-form-item>
        <el-form-item label="AvatarUri">
          <el-input v-model="user.avatarUri" placeholder="Account avatarUri"/>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="user.password" placeholder="Account password"/>
        </el-form-item>
        <el-form-item label="commentDisabled">
          <el-input v-model="user.commentDisabled" placeholder="Account commentDisabled"/>
        </el-form-item>
        <el-form-item label="notifyDisabled">
          <el-input v-model="user.notifyDisabled" placeholder="Account notifyDisabled"/>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="user.status" placeholder="Account status">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">{{ $t('permission.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('permission.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from "path";
import { deepClone } from "@/utils";
import { statusFilter, roleFilter } from "@/filters"
import { getUsers, addUser, updateUser, deleteUser } from "@/api/user";
import { getRoles } from "@/api/role"
import i18n from "@/lang"
import elDragDialog from '@/directive/el-dragDialog'

const defaultUser = {
  id: 0,
  name: "",
  gender: 0,
  role: 5,
  status: 0,
  code: "",
  phone: "",
  email: "",
  desc: "",
  avatarUri: "",
  password: "",
  commentDisabled: 0,
  notifyDisabled: 0,
  updateTime: "",
  createTime: ""
};

export default {
  directives: { elDragDialog },
  data() {
    return {
      // roleList: [],
      userList: [],
      user: Object.assign({}, defaultUser),
      statusList: [
        {
          id: -1,
          name: "禁用"
        },
        {
          id: 0,
          name: "正常"
        }
      ],
      dialogVisible: false,
      dialogType: "new"
    };
  },
  filters: {
    roleFilter(id, list) {
      return list.find(r => r.id == id).name;
    },
    statusFilter(id, list) {
      return list.find(s => (s.id == id)).name;
    },
    statusTagFilter(id) {
      // const types =  ['success', 'info', 'warning', 'danger']
      switch (id) {
        case -1: return 'danger'; break;
        case 0: return 'success'; break;
        default: return ''; break;
      }
    }
  },
  created() {
    this.getUsers();
  },
  computed: {
    roleList() {
      return this.$store.getters.roleList;
    }
  },
  methods: {
    // async getRoles() {
    //   const res = await getRoles();
    //   this.roleList = res.data;
    // },
    async getUsers() {
      const res = await getUsers();
      this.userList = res.data.data;
    },
    i18n(routes) {
      const app = routes.map(route => {
        route.title = i18n.t(`route.${route.title}`);
        if (route.children) {
          route.children = this.i18n(route.children);
        }
        return route;
      });
      return app;
    },
    handleAddUser() {
      this.user = Object.assign({}, defaultUser);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
     handleDrag() {
      // this.$refs.select.blur()
    },
    handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.user = deepClone(scope.row);
    },
    handleDelete({ $index, row }) {
      this.$confirm("Confirm to remove the role?", "Warning", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(async () => {
          deleteUser(row.id).then(
            res => {
              const body = res.data;
              let success = body.code == 200;
              this.$notify({
                message: success ? "删除成功！" : body.msg,
                type: success ? "success" : "warning"
              });
              this.getUsers();
            },
            err => {
              this.$notify.error({
                title: "请求错误",
                message: err
              });
            }
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    async confirm() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        updateUser(this.user)
          .then(
            res => {
              const body = res.data;
              let success = body.code == 200;
              this.$notify({
                message: success ? "设置成功" : body.msg,
                type: success ? "success" : "warning"
              });
              this.getUsers();
            },
            err => {
              this.$notify.error({
                title: "请求错误",
                message: err
              });
            }
          )
          .catch(err => {
            console.error(err);
          });
      } else {
        addUser(this.user)
          .then(
            res => {
              const body = res.data;
              let success = body.code == 200;
              if (success) {
                const { desc, code, name } = this.user;
                this.$notify({
                  title: "Success",
                  dangerouslyUseHTMLString: true,
                  message: `
                            <div>Role Key: ${code}</div>
                            <div>Role Nmae: ${name}</div>
                            <div>Description: ${desc}</div>
                          `,
                  type: "success"
                });
                this.getUsers();
              } else {
                this.$notify({
                  message: body.msg,
                  type: "warning"
                });
              }
            },
            err => {
              this.$notify.error({
                title: "请求错误",
                message: err
              });
            }
          )
          .catch(err => {
            console.error(err);
          });
      }
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
