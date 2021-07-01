<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px" :inline="true">
      <el-button type="primary" @click="dialogFormVisible = !dialogFormVisible"
        >新增命名空间</el-button
      >
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id" />
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" placeholder="编码" clearable />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述" clearable />
      </el-form-item>
      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
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
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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
    <create-namespace-dialog :visible.sync="dialogFormVisible"
      @refreshList="onSubmit" ></create-namespace-dialog>
  </div>
</template>

<script>
import { getNamespaceList, createNamespace } from "@/api/namespace";
import CreateNamespaceDialog from "./create_dialog";

export default {
  components: {
    CreateNamespaceDialog,
  },
  filters: {
  },
  data() {
    return {
      list: null,
      listLoading: true,
      form: {},
      pageIndex: 1,
      pageSize: 10,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dataTotal: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    currentPageInfo() {
      return {
        "page_size": this.pageSize,
        "page_index": this.pageIndex,
      }
    },
    fetchData(params={}) {
      for (var key in this.form) {
        if (this.form[key]) {
          params[key] = this.form[key]
        }
      }
      this.$message.success(JSON.stringify(params));
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
    onSubmitWithCreate() {
      createNamespace(this.create_form).then((response) => {
        if (response.code === 0) {
          this.$message({
            message: "创建成功!",
            type: "success",
          });
          this.dialogFormVisible = false;
          this.fetchData();
        } else {
          this.$message({
            message: "创建失败!",
            type: "error",
          });
        }
      });
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
  },
};
</script>
