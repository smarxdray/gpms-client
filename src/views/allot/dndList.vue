<template>
  <div class="components-container">
    <code>drag-list base on
      <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a>
    </code>
    <el-select v-model="teacherId" placeholder="请先选择导师">
    <el-option
      v-for="item in teacherList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
    <div class="editor-container">
      <dnd-list :list1="studentsAlloted" :list2="studentsRest" :list1-title="list1Title" list2-title="待分配学生" />
      <div style="text-align:right;">
        <!-- <el-button type="danger" @click="dialogVisible=false">{{ $t('permission.cancel') }}</el-button> -->
        <el-button type="primary" @click="confirmRole">{{ $t('permission.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'
import { getTeachers, getStudents } from '@/api/user'
import i18n from "@/lang"

export default {
  name: 'DndListDemo',
  components: { DndList },
  data() {
    return {
      teacherList: [],
      teacherId: '',
      teacherSelected: {},
      studentsAlloted: [],
      studentsRest: [],
    }
  },
  computed: {
    list1Title() {
      if (!this.teacherId) return '请先选择一位导师'
      else return '拖拽右侧学生到此处以分配给导师' +  this.teacherList.filter( v => v.id == this.teacherId)[0].name
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      getTeachers().then(response => {
        this.teacherList = response.data
      })
      getStudents().then(response => {
        this.studentsRest = response.data
      })
    }
  }
}
</script>

