<template>
  <div class="app-container">
    <template v-if="forbidden">
      <p>尚未分配学生，无法操作！</p>
    </template>
    <template v-else>
      <p v-if="isTeacher">您有{{detail.studentNumber}}名学生，请提交不少于该数量的课题。</p>
      <p v-if="hasProject">您已选择了ID为{{detail.project}}的课题</p>
      <router-link to="/project/create">
        <el-button type="primary" v-if="isTeacher" :disabled="!canCreate">添加课题</el-button>
      </router-link>
      <el-button type="primary" v-if="isTeacher" :disabled="!canSubmit" @click="handleSummit">提请审核</el-button>
      <el-button type="primary" v-if="isTeacher" :disabled="!canPublish" @click="handlePublish">课题公布</el-button>
      <el-table :data="list" style="width: 100%;margin-top:30px;" border>
        <el-table-column align="center" label="ID" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题" width="600">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>

        <el-table-column class-name="status-col" label="Status" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status | statusTagFilter "
            >{{ scope.row.status | statusFilter(statusList)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="认领学生">
          <template slot-scope="scope">
            <span>{{ scope.row.studentName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="Operations">
          <template slot-scope="scope">
            <router-link :to="`/project/detail/${scope.row.id}`">
              <el-button type="primary" size="small">详情</el-button>
            </router-link>
            <router-link :to="`/project/edit/${scope.row.id}`">
              <el-button
                v-if="isTeacher"
                :disabled="!(scope.row.status == -1 || scope.row.status == 10)"
                type="primary"
                size="small"
              >编辑</el-button>
            </router-link>
            <el-button
              :disabled="!(scope.row.status === -1)"
              type="danger"
              size="small"
              v-if="isTeacher"
              @click="handleDelete(scope)"
            >删除</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="isStudent && !canUnselect(scope.row)"
              :disabled="detail.project != null || scope.row.student != null"
              @click="handleSelect(scope.row)"
            >选择</el-button>
            <el-button
              type="primary"
              size="small"
              v-if="canUnselect(scope.row)"
              @click="handleUnselect(scope.row)"
            >取消选择</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </template>
  </div>
</template>

<script>
import { fetchList } from "@/api/article";
import { getUserById, getUserDetail } from "@/api/user";
import { getNotices, pullUnreadNotices } from "@/api/notice";
import {
  getProjects,
  getProjectsByTeacher,
  addProjects,
  updateProjectsByTeacher,
  deleteProject
} from "@/api/project";
import { selectProject, unselectProject } from "@/api/transaction";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { resolve, reject } from 'q';

export default {
  name: "ArticleList",
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      list: [],
      userList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      statusList: this.$store.getters.projectStatus,
      detail: {},
      teacherId: undefined,
      key: "projectList"
    };
  },
  computed: {
    name() {
      return this.$store.name;
    },
    isAdmin() {
      return this.$store.getters.roles.indexOf("admin") != -1;
    },
    isTeacher() {
      return this.$store.getters.roles.indexOf("teacher") != -1;
    },
    isStudent() {
      return this.$store.getters.roles.indexOf("student") != -1;
    },
    forbidden() {
      if (this.isTeacher && this.detail.studentNumber <= 0) return true;
      else return false;
    },
    canCreate() {
      if (
        this.isTeacher &&
        this.detail.studentNumber > 0 &&
        this.detail.projectStatus < 11
      )
        return true;
      else return false;
    },
    canSubmit() {
      if (
        this.isTeacher &&
        this.detail.studentNumber <= this.list.length &&
        this.detail.projectStatus < 11
      )
        return true;
      else false;
    },
    canPublish() {
      if (this.isTeacher && this.detail.projectStatus == 11) return true;
      else return false;
    },
    hasProject() {
      return this.detail.project != null;
    },
    canSelect() {
      if (this.isStudent && this.detail.project) return false;
      else return true;
    },
  },
  created() {
    this.getDetail()
      .then(() => {
        if (this.isTeacher) this.teacherId = this.$store.getters.user.id;
        if (this.isStudent) this.teacherId = this.detail.teacher;
        if (this.isAdmin) this.teacherId = this.$route.params.id;
        if (this.teacherId == undefined) {
          this.list = [];
          return;
        }
        this.getList(this.teacherId);
      });
  },
  filters: {
    statusFilter(id, list) {
      return list.find(s => s.id == id).name;
    },
    statusTagFilter(id) {
      switch (id) {
        case -1:
          return "danger";
          break;
        case 0:
          return "warning";
      }
    }
  },
  methods: {
    handleEdit(scope) {
      this.$router.push({
        name: "ProjectEdit",
        params: {
          project: scope.row
        }
      });
    },
    handleSelect(project) {
      selectProject(this.$store.getters.user.id, project.id).then(res => {
        let body = res.data;
        let success = body.code == 200;
        this.$notify({
            message: success ? "选择成功！" : "操作失败！",
            type: success ? "success" : "warning"
          });
          if (success) {
            this.getDetail();
            this.getList(this.teacherId);
          }
      });
    },
    canUnselect(project) {
      return project.student === this.$store.getters.user.id ? true : false
    },
    handleUnselect(project) {
      unselectProject(this.$store.getters.user.id, project.id).then(res => {
        console.log(res)
        let body = res.data;
        let success = body.code == 200;
        this.$notify({
            message: success ? "取消成功！" : "操作失败！",
            type: success ? "success" : "warning"
          });
          if (success) {
            this.getDetail();
            this.getList(this.teacherId);
          }
      });
    },
    handleDelete(scope) {
      deleteProject(scope.row.id).then(res => {
        let body = res.data;
        let success = body.code == 200;
        if (!success) {
          this.$notify({
            message: body.msg,
            type: "warning"
          });
        }
        this.list.splice(scope.$index, 1);
      });
    },
    hasPermission(scope) {
      return this.isAdmin || (this.isTeacher && this.name == scope.row.author);
    },
    getList(teacherId) {
      this.listLoading = true
      getProjects({teacher: teacherId}).then(res => {
          let body = res.data;
          let success = body.code == 200;
          if (!success) {
            this.$notify({
              message: body.msg,
              type: "warning"
            });
          }
          this.list = body.data;
        this.listLoading = false;
        });
    },
    getDetail() {
      return getUserDetail(this.$store.getters.user.id)
      .then(res => {
        let body = res.data;
        let success = body.code == 200;
        if (success) {
          this.detail = body.data;
        }
        return new Promise((resolve, reject) => {
            resolve();
        });
      })
    },
    handleSummit() {
      //   getTeacherDetail(this.$store.getters.user.id).then(res => {
      //   let body = res.data;
      //   let success  =  body.code == 200;
      //   if (!success) {
      //     this.$notify({
      //       message: '无法拉取服务端信息！',
      //       type: 'warning'
      //     })
      //   }
      //   let detail = body.data;
      //   this.number = detail.studentNumber;
      //   console.log(this.number)
      // })
      if (!this.canSubmit) {
        return this.$notify({
          message: "不符合提请审核要求！",
          type: "warning"
        });
      }
      this.list.forEach(p => {
        p.status = 0;
      });
      addProjects(this.list).then(
        res => {
          let success = res.data.code == 200;
          this.$notify({
            message: success ? "提交成功！" : res.data.msg,
            type: success ? "success" : "warning"
          });
          if (!success) {
            this.list.forEach(p => {
              p.status = -1;
            });
          }
        },
        err => {
          this.$notify.error({
            message: err
          });
        }
      );
    },
    handlePublish() {
      if (!this.canPublish) {
        return this.$notify({
          message: "不符合发布课题要求！",
          type: "warning"
        });
      }
      updateProjectsByTeacher(this.teacherId, 110).then(
        res => {
          let success = res.data.code == 200;
          this.$notify({
            message: success ? "发布成功！" : res.data.msg,
            type: success ? "success" : "warning"
          });
          if (!success) {
            this.list.forEach(p => {
              p.status = -1;
            });
          }
        },
        err => {
          this.$notify.error({
            message: err
          });
        }
      );
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin: 0 auto;
  width: 80%;
  margin-bottom: 10px;
}
</style>
