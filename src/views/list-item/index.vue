<template>
  <div class="app-container">
    <el-button type="primary" @click="handleCreateListItem">
      新增名单项
    </el-button>
    <el-form ref="form" :model="form" :inline="true">
      <el-form-item label="ID">
        <el-input v-model="form.id" placeholder="ID" clearable id="input_id" />
      </el-form-item>
      <el-form-item label="命名空间">
        <el-select v-model="form.namespace" placeholder="请选择命名空间">
          <el-option
            v-for="code in namespaceCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名单类型编码">
        <el-select v-model="form.code" placeholder="请选择名单类型编码">
          <el-option label="查询所有名单类型编码" value="" style="color: red">
          </el-option>
          <el-option
            v-for="code in listTypeCodeList"
            :key="code"
            :label="code"
            :value="code"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="是否生效">
        <el-select v-model="form.is_valid" placeholder="请选择是否生效">
          <el-option label="全部" value=""></el-option>
          <el-option label="生效" value="true"></el-option>
          <el-option label="失效" value="false"></el-option>
        </el-select>
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
      @cell-dblclick="handleUpdateListItem"
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

      <el-table-column
        align="center"
        :label="'字段[' + item + ']'"
        width="200"
        v-for="item in fieldNameList"
        :key="item"
      >
        <template slot-scope="scope">
          {{ scope.row.fieldValueMap[item] }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否生效" width="200">
        <template slot-scope="scope">
          {{ scope.row.is_valid_str }}
        </template>
      </el-table-column>

      <el-table-column label="业务额外属性" align="center">
        <template slot-scope="scope">
          <span>{{ JSON.stringify(scope.row.extra) }}</span>
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
        :total="tableTotal"
      >
      </el-pagination>
    </div>
    <handle-item-dialog
      :visible.sync="handleDialogFormVisible"
      :namespaceCodeList.sync="namespaceCodeList"
      :form.sync="selectData"
      :dialogType.sync="dialogType"
      @closeDialog="handleDialogFormVisible = false"
      @refreshTable="onSubmit"
    />
  </div>
</template>

<script>
import HandleItemDialog from "./handle-item-dialog";
import { getListTypeCodeList, getListTypes } from "@/api/list-type";
import { getNamespaceCodeList } from "@/api/namespace";
import { getListItems } from "@/api/list-item";

export default {
  components: {
    HandleItemDialog,
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
      list: [],
      listLoading: true,
      form: {
        namespace: "",
        code: "",
      },
      selectData: this.newSelectData(),
      pageIndex: 1,
      pageSize: 10,
      tableTotal: 0,
      handleDialogFormVisible: false,
      formLabelWidth: "120px",
      namespaceCodeList: [],
      listTypeCodeList: [],
      listTypeMap: {},
      fieldNameList: [],
      dialogType: "create",
    };
  },
  async created() {
    this.namespaceCodeList = await getNamespaceCodeList();
    if (this.namespaceCodeList.length > 0) {
      this.form.namespace = this.namespaceCodeList[0];
    }
  },
  methods: {
    newSelectData() {
      return {
        namespace: "",
        code: "",
      };
    },
    convertData(data) {
      data.fieldValueMap = {};
      for (const i in data.multi_value ) {
        let element = data.multi_value[i];
        data.fieldValueMap[element.key] = element.value;
      }
      data.is_valid_str = data.is_valid ? "生效" : "失效";
    },
    async fetchData() {
      if (this.form.namespace === "") {
        return;
      }
      this.listLoading = true;

      await getListItems(this.form).then((response) => {
        if (response.code === 0) {
          this.list = response.data;
          if (this.list != null) {
            for (let index = 0; index < this.list.length; index++) {
              const element = this.list[index];
              this.convertData(element);
            }
          }
          // console.log(`this.list: ${JSON.stringify(this.list)}`);
          this.tableTotal = response.total;
          this.listLoading = false;
        }
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
    handleCreateListItem() {
      this.dialogType = "create";
      this.handleDialogFormVisible = true;
    },
    handleUpdateListItem(row) {
      this.selectData = JSON.parse(JSON.stringify(row));
      this.selectData.extra = JSON.stringify(this.selectData.extra);
      this.selectData.is_valid = this.selectData.is_valid ? "true" : "false"
      console.log(`select data: ${JSON.stringify(this.selectData)}`);
      this.dialogType = "update";
      this.handleDialogFormVisible = true;
    },
    handleSelectChange(selectedRowList) {
      this.selectedRowList = selectedRowList;
    },
  },
  watch: {
    "form.namespace": async function () {
      this.form.code = "";
      this.listTypeCodeList = [];
      let req = { namespace: this.form.namespace };
      await getListTypes(req).then((response) => {
        let data = response.data;
        if (data == null) {
          return;
        }
        this.listTypeMap = {};
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          this.listTypeMap[element.code] = element;
          this.listTypeCodeList.push(element.code); 
        }
      });
      // console.log(
      //   `this.listTypeCodeList: ${JSON.stringify(this.listTypeCodeList)}`
      // );
      if (this.listTypeCodeList != null && this.listTypeCodeList.length > 0) {
        this.form.code = this.listTypeCodeList[0];
      }
    },
    "form.code": function () {
      if (this.form.code == "") {
        return;
      }
      if (this.listTypeMap[this.form.code] != null) {
        this.fieldNameList = this.listTypeMap[this.form.code].fields;
      } else {
        this.fieldNameList = [];
      }
      this.onSubmit();
    },
  },
};
</script>
