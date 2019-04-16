<template>
  <div class="app-container">
    <router-link to="/project/create">
    <el-button type="primary">添加课题</el-button>
    </router-link>
    <el-button type="primary" @click="handleSummit">提交所有</el-button>
    <el-table :data="list" style="width: 100%;margin-top:30px;" border>
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
          <el-tag :type="scope.row.status | statusTagFilter ">{{ scope.row.status | statusFilter(statusList)}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <router-link :to="`/project/edit/${scope.$index}`">
          <el-button
            type="primary"
            size="small"
          >{{ $t('permission.editRole') }}</el-button>
          </router-link>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >{{ $t('permission.delete') }}</el-button>
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
  </div>
</template>

<script>
import { fetchList } from "@/api/article";
import { getNotices, pullUnreadNotices } from "@/api/notice";
import { addProjects } from '@/api/project'
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

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
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      statusList: [
        {
          id: -1,
          name: '草稿'
        },{
          id: 0,
          name: '待审核'
        },{
          id: 1,
          name: '已审核'
        },{
          id: 10,
          name: '待认领'
        },{
          id: 11,
          name: '已认领'
        }
      ],
      key: 'projectList'
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
    }
  },
  created() {
    let list = localStorage[this.key]
    if (!list) {
      localStorage[this.key] = JSON.stringify(this.list);
    } else {
      this.list = JSON.parse(list);
    }
  },
  filters: {
    statusFilter(id, list) {
      return list.find(s => s.id == id).name
    },
    statusTagFilter(id) {
      switch(id) {
        case -1: return 'danger';
        break;
        case 0: return 'warning';
      }
    }
  },
  watch: {
    list(newVal, oldVal) {
      localStorage[this.key] = JSON.stringify(this.list)
    }
  },
  methods: {
    handleEdit(scope) {
      this.$router.push({
        name: 'ProjectEdit',
        params: {
          project: scope.row
        }
      })
    },
    handleDelete(scope) {
      let idx = scope.$index;
      this.list.splice(idx, 1);
    },
    hasPermission(scope) {
      return this.isAdmin || (this.isTeacher && this.name == scope.row.author);
    },
    async getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      // })
      // const res = await getNotices();
      // this.list = res.data.data;
      // this.listLoading = false;
    },
    handleSummit() {
      let data = {
        projects: this.list
      }
      addProjects(data).then(res => {
        let success = res.data.code == 200;
        this.$notify({
          message: success ? '提交成功！' : res.data.msg,
          type: success ? 'success' : 'warning'
        })
        this.list.forEach(p => {
          p.status = 0;
        })
      }, err => {
        this.$notify.error({
          message: err
        })
      })
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
