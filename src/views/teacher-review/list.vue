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

      <el-table-column class-name="status-col" label="已审次数" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.detail.reviewTimes }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" min-width="300px" label="课题">
        <template slot-scope="scope">
          <router-link :to="`/project/detail/${scope.row.detail.project}`" class="link-type">
            <span>{{ scope.row.detail.projectTitle }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getFiles(scope.row.basic.id)">查看文件</el-button>
          <el-button v-if="scope.row.detail.status > 10" type="primary" size="small" @click="handleComment(scope.row)">打分</el-button>
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

    <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :title="'文件列表'">
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

        <el-table-column align="center" width="80" label="类型">
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
              <a :href="`http://localhost:8086/files/${scope.row.id}/download`">下载</a>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-el-drag-dialog :visible.sync="commentDialogVisible" title="成绩评定">
      <el-form :model="comment" label-width="80px" label-position="left">
        <el-form-item label="Code">
          <el-input v-model="currentStudent.basic.code" readonly/>
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="currentStudent.basic.name" readonly/>
        </el-form-item>
        <el-form-item label="Mark">
          <el-input type="number" v-model="comment.mark" placeholder="百分制"/>
        </el-form-item>
        <el-form-item label="Content">
          <el-input type="textarea" v-model="comment.content" placeholder="评语"/>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="commentDialogVisible=false">{{ $t('permission.cancel') }}</el-button>
        <el-button type="primary" @click="submitComment">{{ $t('permission.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserById, getStudentsByTeacher } from "@/api/user";
import { getFilesByOwner } from "@/api/file";
import { addComment } from '@/api/comment';
import elDragDialog from "@/directive/el-dragDialog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ArticleList",
  directives: { elDragDialog },
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
      currentStudent: {
        basic: {
          code: "",
          name: ""
        }
      },
      comment: {
        author: 0,
        target: 0,
        mark: 0,
        content: ""
      },
      listQuery: {
        page: 1,
        limit: 20
      },
      fileList: [],
      dialogVisible: false,
      commentDialogVisible: false
    };
  },
  created() {
    this.comment.author = this.$store.getters.user.id
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
      });
    },
    handleComment(student) {
      this.currentStudent = student;
      this.commentDialogVisible = true;
    },
    submitComment() {
      addComment(this.comment).then(res => {
        let body = res.data;
        let success = body.code == 200;
        this.$notify({
          message: success ? '评分成功！' : '评分失败！',
          type: success ? 'success' : 'warning'
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
</style>
