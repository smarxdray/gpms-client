<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.college" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in collegeOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.major" :placeholder="$t('table.type')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in majorOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.type" style="width: 140px" class="filter-item" @change="handleTypeChange">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="'学工号'" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.basic.code}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('table.title')" min-width="150px">
        <template slot-scope="scope"> -->
          <!-- <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span> -->
          <!-- <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('table.author')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.basic.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showReviewer" :label="$t('table.reviewer')" width="110px" align="center">
        <template slot-scope="scope">
          <span style="color:red;">{{ scope.row.reviewerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学院" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.detail.college }}</span>
          <!-- <svg-icon v-for="n in +scope.row.college" :key="n" icon-class="star" class="meta-item__icon" /> -->
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.detail.major }}</span>
          <!-- <span v-if="scope.row.major" class="link-type" @click="handleFetchPv(scope.row.pageviews)">{{ scope.row.pageviews }}</span> -->
          <!-- <span v-else>0</span> -->
        </template>
      </el-table-column>
      <el-table-column label="学生人数" class-name="status-col" width="100">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.basic.status | statusFilter">{{ scope.row.status }}</el-tag> -->
          <span>{{ scope.row.detail.studentNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusTagFilter "
          >{{ scope.row.detail.projectStatus | statusFilter(projectStatusList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="getProjects(scope.row)">查看详情</el-button>
          <el-button :disabled="scope.row.detail.projectStatus > 0" size="mini" type="success" @click="handleApprove(scope.row)">批准</el-button>
          <el-button :disabled="scope.row.detail.projectStatus > 0" size="mini" type="danger" @click="handleUnapprove(scope.row)">不予批准</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item :label="$t('table.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.importance')">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { getColleges, getMajors } from '@/api/etc'
import { getProjectDetails, updateProjectsByTeacher } from '@/api/project' 
import { getTeachersHavingProjects, getTeachersByQuery } from '@/api/user'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      switch(status) {
        case -1: return 'danger'; break;
        case 0: return 'warning'; break;
      }
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        college: '',
        major: '',
        type: undefined,
        sort: '+id',
        projectStatus: 0
      },
      collegeOptions: [],
      majorOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      typeOptions: [{ label: '课题', key: 0 }, { label: '文件', key: 1 }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      projectStatusList: [
        {
          id: -1,
          name: "未提交"
        },
        {
          id: 0,
          name: "待审核"
        },
        {
          id: 10,
          name: "审核未通过"
        },
        {
          id: 11,
          name: "通过"
        },
        {
          id: 110,
          name: '未认领'
        },
        {
          id: 111,
          name: '已认领'
        }
      ],
    }
  },
  created() {
    this.getList()
  },
  computed: {
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
    getList() {
      this.listLoading = true
      getTeachersByQuery(this.listQuery).then(res => {
        let body = res.data;
        this.list = body.data;
        // this.total = response.data.total
        this.listLoading = false
      });
      getColleges().then(res => {
        let body = res.data;
        this.collegeOptions = body.data; 
      });
      getMajors().then(res => {
        let body = res.data;
        this.majorOptions = body.data;
      })
    },
    getProjects(row) {
      let teacherId = row.basic.id;
      this.$router.push({
        name: 'ProjectList',
        params: {
          id: teacherId
        }
      })
    },
    handleFilter() {
      // this.listQuery.page = 1
      // this.getList()
      // this.list.filter(t => {
      //   let a = this.listQuery.college == undefined? true : (this.listQuery.college == t.college);
      //   let b = this.listQuery.major == undefined ? true : (this.listQuery.major == t.major);
      //   return a && b;
      // })
      getTeachersByQuery(this.listQuery).then(res => {
        this.list = res.data.data;
      })
    },
    handleTypeChange() {
      getFilesByQuery
    },
    handleApprove(row) {
      let project = {
        teacher: row.basic.id,
        status: 11,
        reviewer: this.$store.getters.user.id
      }
      updateProjectsByTeacher(project).then(res => {
        let success = res.data.code == 200
        if (success) this.$notify({
          message: '成功！',
          type: 'success'
        })
      })
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleUnapprove(row) {
      updateProjectsByTeacher(row.basic.id, 10).then(res => {
        let success = res.data.code == 200;
        if (success) {
          this.$notify({
          message: '操作成功！请消息通知该导师',
          type: 'warning'
        })
        this.$router.push({
          name: 'Notify',
          query: {
            to: row.basic.id
          }
        })
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
