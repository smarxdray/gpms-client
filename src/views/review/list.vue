<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.basic.code }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="最近提交">
        <template slot-scope="scope">
          <span>{{ scope.row.basic.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="学生姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.basic.name }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column>-->

      <el-table-column class-name="status-col" label="已审次数" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.detail.reviewTimes }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" min-width="300px" label="课题">
        <template slot-scope="scope">
          <router-link :to="'/example/edit/'+scope.row.detail.projectTitle" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
            <el-button type="primary" size="small" @click="getFiles(scope.row.basic.id)">查看文件</el-button>
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

      <el-dialog
      :visible.sync="dialogVisible"
      :title="'文件列表'"
    >
      <el-table
      v-loading="listLoading"
      :data="fileList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column width="232px" align="center" label="文件名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center"  width="80" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.extension }}</span>
        </template>
      </el-table-column>

      <el-table-column width="80px" align="center" label="大小">
        <template slot-scope="scope">
          <span>{{ (scope.row.size / (1024 * 1024)).toFixed(2) }} M</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="最近提交" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
            <el-button type="primary" size="small">
              <a :href="'http://localhost:8086/files/download/' + scope.row.id">下载</a>
            </el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getUserById, getStudentsByTeacher } from "@/api/user";
import { getFilesByOwner } from "@/api/file";
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      fileList: [],
      dialogVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getStudentsByTeacher(this.$store.getters.user.id).then(res => {
        let body = res.data;
        this.list = body.data;
        this.total = this.list.length;
        this.listLoading = false;
      });
    },
    getFiles(ownerId) {
      getFilesByOwner(ownerId).then(res => {
        let body = res.data;
        this.fileList = body.data;
        this.dialogVisible = true;
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
</style>
