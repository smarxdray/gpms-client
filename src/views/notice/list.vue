<template>
  <div class="app-container">
    <!-- <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >-->
    <el-card v-for="n in list" :key="n.id" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{n.title}}</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <router-link :to="'/notice/detail/'+n.id" class="link-type">
        <div class="text item">发布者：{{ n.author }}</div>
        <div class="text item">发布日期：{{ n.updateTime | parseTime('{y}-{m}-{d}') }}</div>
        <div class="text item">摘要：{{ n.contentShort.length ? n.contentShort : '暂无摘要' }}</div>
      </router-link>
    </el-card>

    <!-- <el-table-column width="180px" align="center" label="Date">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="Importance">
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" min-width="300px" label="Title">
        <template slot-scope="scope">
          <router-link :to="'/notice/detail/'+scope.row.id" class="link-type">
            <span>{{ scope.row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="scope">
          <router-link :to="'/notice/edit/'+scope.row.id" v-if="hasPermission(scope)">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
        </template>
    </el-table-column>-->
    <!-- </el-table> -->

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
      }
      // socket: io('localhost:8086')
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
    this.getList();
  },
  methods: {
    hasPermission(scope) {
      return this.isAdmin || (this.isTeacher && this.name == scope.row.author);
    },
    async getList() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total

      // })
      const res = await getNotices();
      this.list = res.data.data;
      this.listLoading = false;
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
