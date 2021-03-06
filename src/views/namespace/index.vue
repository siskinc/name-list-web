<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-button
        type="primary"
        @click="handleCreateNamespace"
        >新增命名空间</el-button
      >
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id"/>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" placeholder="编码" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述" clearable />
      </el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteNamespace"></el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @cell-dblclick="handleUpdateNamespace"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="ID" width="200" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="编码" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdateNamespace(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="dataTotal"
      >
      </el-pagination>
    </div>
    <handle-namespace-dialog
      :visible.sync="dialogFormVisible"
      :form="select_data"
      :dialog_type.sync="dialog_type"
      @refreshList="onSubmit"
    ></handle-namespace-dialog>
  </div>
</template>

<script>
import { getNamespaceList, deleteNamespace } from "@/api/namespace";
import HandleNamespaceDialog from "./handle-dialog";

export default {
  components: {
    HandleNamespaceDialog,
  },
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      form: {},
      select_data: {},
      pageIndex: 1,
      pageSize: 10,
      dialogFormVisible: false,
      dialog_type: "",
      formLabelWidth: "120px",
      dataTotal: 0,
      selected_rows: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    currentPageInfo() {
      return {
        page_size: this.pageSize,
        page_index: this.pageIndex,
      };
    },
    fetchData(params = {}) {
      for (var key in this.form) {
        if (this.form[key]) {
          params[key] = this.form[key];
        }
      }
      this.listLoading = true;
      getNamespaceList(params).then((response) => {
        this.list = response.data;
        this.dataTotal = response.total;
        this.listLoading = false;
      });
    },
    onSubmit() {
      this.fetchData(this.currentPageInfo());
    },
    handleSizeChange(currentSize) {
      let pageInfo = this.currentPageInfo();
      pageInfo["page_size"] = currentSize;
      this.fetchData(pageInfo);
    },
    handleCurrentChange(currentIndex) {
      let pageInfo = this.currentPageInfo();
      pageInfo["page_index"] = currentIndex;
      this.fetchData(pageInfo);
    },
    handleUpdateNamespace(row) {
      this.select_data = row;
      this.dialog_type = "update";
      this.dialogFormVisible = true;
    },
    handleCreateNamespace() {
      this.select_data = {};
      this.dialog_type = "create";
      this.dialogFormVisible = true;
    },
    async handleDeleteNamespace() {
      for (let i in this.selected_rows) {
        let _id = this.selected_rows[i].id;
        let code = this.selected_rows[i].code;
        await deleteNamespace(_id).then((response)=>{
          if (response.code === 0) {
            this.$message.success(`删除 "${code}" 命名空间成功`)
          }
        });
      }
      this.fetchData()
    },
    handleSelectChange(selected_rows) {
      this.selected_rows = selected_rows;
    },
  },
};
</script>
