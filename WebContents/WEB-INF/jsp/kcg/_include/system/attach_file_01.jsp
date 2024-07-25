<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	String atch_file_no = request.getParameter("atch_file_no");
%>
<%-- <label for="atch_file_<%=atch_file_no %>" class="col-sm-1 control-label">첨부파일</label> --%>
<div class="col-sm-11" v-if="isImgFileNm(info.atch_file_<%=atch_file_no %>_nm)">
	<input type="hidden" id="atch_file_<%=atch_file_no %>" :value="info.atch_file_<%=atch_file_no %>">
	<img :src="'/common/fileDn?p=' + info.atch_file_<%=atch_file_no %>" width="120" alt="">
	<button class="btn btn-black" type="button" style="margin-right: 6px;" @click="cf_fileDn(info.atch_file_<%=atch_file_no %>)">
		<span class="hidden-xs">다운로드</span>
		<i class="entypo-download"></i>
	</button>
	<button class="btn btn-red" type="button" @click="admin_atch_del_fil('<%=atch_file_no %>')">
		<span class="hidden-xs">삭제</span>
		<i class="entypo-minus"></i>
	</button>
</div>
<div v-else>
	<input type="hidden" id="atch_file_<%=atch_file_no %>" :value="atch_file_<%=atch_file_no %>">
	&nbsp;&nbsp;&nbsp;
	<a href="#none" @click="cf_fileDn(info.atch_file_<%=atch_file_no %>)">
		{{info.atch_file_<%=atch_file_no %>_nm}}
	</a>
	&nbsp;&nbsp;&nbsp;
	<button class="btn btn-red" type="button" @click="admin_atch_del_fil('<%=atch_file_no %>')">
		<span class="hidden-xs">삭제</span>
		<i class="entypo-minus"></i>
	</button>
</div>