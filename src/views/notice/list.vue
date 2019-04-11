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
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
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
import { getNotices } from "@/api/notice";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import SockJS from "sockjs-client";
import Stomp from "stompjs";

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
    this.connect();
  },
  methods: {
    //连接
    connect() {
      let stompClient = Stomp.over(new SockJS("http://localhost:8086/stomp-websocket"));

      stompClient.connect(
        {},
        () => {
          console.log("Info: STOMP connection opened.");

          //订阅服务端的/topic/greeting地址
          stompClient.subscribe("/broadcast/notices", function(res) {
            alert("Received: " + JSON.parse(res.body));
          });
        },
        () => {
          //断开处理
          console.log("Info: STOMP connection closed.");
        }
      );
      return stompClient;
    },

    //断开连接
    disconnect(stompClient) {
      if (stompClient != null) {
        stompClient.disconnect();
        stompClient = null;
      }
      log("Info: STOMP connection closed.");
      return stompClient;
    },

    //向服务端发送姓名
    sendName(stompClient) {
      if (stompClient != null) {
        var username = "username";
        console.log("Sent: " + username);
        stompClient.send(
          "/message/hello",
          {},
          JSON.stringify({ name: username })
        );
      } else {
        alert("STOMP connection not established, please connect.");
      }
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
</style>
