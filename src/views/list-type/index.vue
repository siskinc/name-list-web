<template>
  <div class="app-container">
    <div>
      <el-button type="primary" @click="handleCreateListType">
        新增名单类型
      </el-button>
    </div>
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable/>
      </el-form-item>
      <el-form-item label="命名空间">
        <el-select v-model="form.namespace" placeholder="请选择命名空间">
          <el-option label="查询所有命名空间" value="" style="color: red;"></el-option>
          <el-option
            v-for="code in namespaceCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" placeholder="编码" clearable />
      </el-form-item>

      <el-form-item label="是否生效">
        <el-select v-model="form.is_valid" placeholder="请选择是否生效">
          <el-option label="全部" value=""></el-option>
          <el-option label="生效" value="true" ></el-option>
          <el-option label="失效" value="false" ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" placeholder="描述" clearable />
      </el-form-item>

      <el-button-group>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="handleDeleteListType"></el-button>
      </el-button-group>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @cell-dblclick="handleUpdateListType"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="ID" width="210" fixed="left">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="命名空间" width="200">
        <template slot-scope="scope">
          {{ scope.row.namespace }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="编码" width="200">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="字段列表" width="200">
        <template slot-scope="scope">
          {{ scope.row.fields_str }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否生效" width="200">
        <template slot-scope="scope">
          {{ scope.row.is_valid_str }}
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdateListType(scope.row)">编辑</el-button>
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
        :total="tableTotal"
      >
      </el-pagination>
    </div>
    <operator-list-type-dialog
      :namespaceCodeList="namespaceCodeList"
      :form.sync="selectData"
      :dialogType.sync="dialogType"
      :visible.sync="dialogFormVisible"
      @closeDialog="closeDialog"
      @refreshTable="onSubmit"
    />
  </div>
</template>

<script>
import { deleteListType, getListTypes } from "@/api/list-type";
import {getNamespaceCodeList} from '@/api/namespace';
import OperatorListTypeDialog from './handle-dialog'
import _ from "lodash";

export default {
  components: {
    OperatorListTypeDialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      tableTotal: 0,
      pageSize: 10,
      pageIndex: 1,
      form: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      namespaceCodeList: [],
      dialogType: "create",
      selectedRowList: [],
      selectData: {},
    };
  },
  created() {
    this.fetchData();
    this.namespaceCodeList = getNamespaceCodeList({page_size:0});
    console.log(this.namespaceCodeList)
  },
  methods: {
    fetchData() {
      let params = {
        page_index: this.pageIndex,
        page_size: this.pageSize
      }
      for (let k in this.form) {
        let v = this.form[k];
        if (v) {
          params[k] = v;
        }
      }
      this.listLoading = true;
      console.log(`params: ${JSON.stringify(params)}`);
      getListTypes(params).then((response) => {
        _.forEach(response.data, function (val) {
          val.fields_str = _.join(val.fields, ",");
          val.is_valid_str = val.is_valid ? "生效" : "失效";
        });
        this.list = response.data;
        this.tableTotal = response.total;
        this.listLoading = false;
      });
    },
    onSubmit() {
      this.fetchData();
    },
    handleSizeChange() {
      this.fetchData();
    },
    handleCurrentChange() {
      this.fetchData();
    },
    handleCreateListType() {
      this.selectData = {};
      this.dialogType = "create";
      this.dialogFormVisible = true;
    },
    handleUpdateListType(row) {
      this.selectData = JSON.parse(JSON.stringify(row));
      this.selectData.is_valid = this.selectData.is_valid.toString()
      this.dialogType = "update";
      this.dialogFormVisible = true;
    },
    handleSelectChange(selectedRowList) {
      this.selectedRowList = selectedRowList
    },
    closeDialog() {
      this.dialogFormVisible = false;
    },
    async handleDeleteListType() {
      for (let index = 0; index < this.selectedRowList.length; index++) {
        const element = this.selectedRowList[index];
        await deleteListType(element.id).then((response) => {
          if (response.code === 0) {
            this.$message.success(`删除 ${element.code} 名单类型成功!`);
          }
        });
      }
      this.fetchData();
    }
  },
};
</script>
