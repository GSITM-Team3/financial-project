<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
        <!DOCTYPE html>
        <html>

        <head>
            <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header_meta.jsp" flush="false" />
            <!-- Imported styles on this page -->
            <link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">
            <link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">
            <link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">
            <link rel="stylesheet" href="/static_resources/system/js/datatables/proddtl.css">
            <title>관리자시스템</title>
        </head>

        <body class="page-body">

            <div class="page-container">

                <jsp:include page="/WEB-INF/jsp/kcg/_include/system/sidebar-menu.jsp" flush="false" />

                <div class="main-content">

                    <jsp:include page="/WEB-INF/jsp/kcg/_include/system/header.jsp" flush="false" />

                    <ol class="breadcrumb bc-3">
                        <li><a href="#none" onclick="cf_movePage('/system')"><i class="fa fa-home"></i>Home</a></li>
                        <li class="active"><strong>고객정보 목록 조회</strong></li>
                    </ol>

                    <h2>고객정보 목록</h2>
                    <br />

                    <div class="flex-column flex-gap-10" id="vueapp">
                        <template>
                            <div class="flex flex-100">
                                <div class="flex-wrap flex-66 flex flex-gap-10 flex-padding-10">
                                    <div class="form-group flex-40">
                                        <label class="fix-width-33">고객명 :</label>
                                        <input class="form-control" v-model="cust_nm" value="">
                                    </div>
                                    <div class="form-group flex-40">
                                        <label class="fix-width-33">관리담당자:</label>
                                        <input class="form-control" v-model="pic_nm" value="">
                                    </div>
                                    <div class="form-group flex-40">
                                        <label class="fix-width-33">생년월일:</label>
                                        <input type="text" class="form-control" v-model="rrno">
                                    </div>
                                    <div class="form-group flex-40">
                                        <label class="fix-width-33">관리부서:</label>
                                        <input type="text" class="form-control" v-model="dept_nm">
                                    </div>
                                </div>

                                <div class="flex-wrap flex-33 flex flex-center flex-gap-10 flex-padding-10">
                                    <div class="form-group" style="width:45%;">
                                        <button type="button" class="btn btn-blue btn-icon icon-left form-control "
                                            v-model="search_val" @click="getCustInfoList(true)">
                                            조건검색
                                            <i class="entypo-search"></i>
                                        </button>
                                    </div>
                                    <div class="form-group" style="width:45%;">
                                        <button type="button" class="btn btn-blue btn-icon icon-left form-control"
                                            v-model="search_val" @click="getCustInfoListAll(true)">
                                            전체검색
                                            <i class="entypo-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-100 flex-padding-10 flex-gap-10"
                                style="justify-content:flex-end;border: 1px solid #999999;">
                                <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;"
                                    @click="popCustmnglistPrint">
                                    관리대장출력
                                    <i class="entypo-archive"></i>
                                </button>
                                <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;"
                                    @click="popCustmngCardPrint">
                                    관리카드출력
                                    <i class="entypo-vcard"></i>
                                </button>
                                <button type="button" class="btn btn-blue btn-icon icon-left" style="margin-left: 5px;"
                                    @click="popDamdangSet">
                                    담당자설정
                                    <i class="entypo-user"></i>
                                </button>
                                <button type="button" class="btn btn-orange btn-icon icon-left"
                                    style="margin-left: 5px;" @click="custInfoMng">
                                    고객관리
                                    <i class="entypo-users"></i>
                                </button>
                                <button type="button" class="btn btn-orange btn-icon icon-left"
                                    style="margin-left: 5px;" @click="picInfoMng">
                                    담당자관리
                                    <i class="entypo-clipboard"></i>
                                </button>
                            </div>
                            <table class="table table-bordered datatable dataTable" id="grid_app"
                                style="border: 1px solid #999999;">
                                <thead>
                                    <tr class="replace-inputs">
                                        <th style="width: 5%;" class="center"><input type="checkbox" id="allCheck"
                                                @click="all_check(event.target)" style="cursor: pointer;"></th>
                                        <th style="width: 20%;" class="center">성명</th>
                                        <th style="width: 15%;" class="center">생년월일</th>
                                        <th style="width: 15%;" class="center">핸드폰번호</th>
                                        <th style="width: 15%;" class="center">직업</th>
                                        <th style="width: 30%;" class="center">주소</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="item in dataList" @dblclick="gotoDtl(item.cust_mbl_telno)"
                                        style="cursor: pointer;">
                                        <td class="center" @dblclick.stop="return false;"><input type="checkbox"
                                                :data-idx="item.cust_nm" name="is_check" @click.stop="onCheck"
                                                style="cursor: pointer;">
                                        </td>
                                        <td class="center">{{item.cust_nm}}</td>
                                        <td class="center">{{item.rrno}}</td>
                                        <td class="center">{{item.cust_mbl_telno}}</td>
                                        <td class="center">{{item.occp_ty_cd_nm}}</td>
                                        <td class="center">{{item.cust_addr}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </div>


                    <jsp:include page="/WEB-INF/jsp/kcg/_include/system/footer.jsp" flush="false" />
                </div>
            </div>

            <!-- 고객기본정보조회 팝업 -->
            <div class="modal fade" id="pop_cust_info">
                <template>
                    <div class="modal-dialog4">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                    id="btn_popClose">&times;</button>
                                <h4 class="modal-title" id="modify_nm">고객기본정보</h4>
                            </div>
                            <div class="modal-body">
                                <form class="form-horizontal form-groups-bordered">
                                    <div class="clearAfter">
                                        <div class="left">
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">작성일자</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="wrt_dt" v-model="info.wrt_dt">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_kor_nm" class="col-sm-3 control-label">성명</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_nm" v-model="info.cust_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">실명번호</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="rrno" v-model="info.rrno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">E-mail</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_eml_addr" v-model="info.cust_eml_addr">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">전화번호</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="co_telno" v-model="info.co_telno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">핸드폰번호</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_mbl_telno"
                                                        v-model="info.cust_mbl_telno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">직업</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="occp_ty_cd_nm" v-model="info.occp_ty_cd_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">주소</label>
                                                <div class="col-sm-9">
                                                    <textarea id="cust_addr" v-model="info.cust_addr"
                                                        style="width:100%;"></textarea>
                                                </div>
                                            </div>

                                        </div>
                                        <div class="right">
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-2 control-label">상담내역</label>
                                            </div>
                                            <div class="col-sm-10">
                                                <tr>
                                                    <textarea id="tsk_dtl_cn" v-model="info.tsk_dtl_cn"
                                                        style="width:100%;"></textarea>
                                                </tr>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <!--// 고객기본정보조회 팝업  -->

            <!-- 관리대장출력 팝업 -->
            <div class="modal fade" id="pop_cust_mnglist_print">
                <template>
                    <div class="modal-dialog4">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                    id="btn_popClose">&times;</button>
                                <h4 class="modal-title" id="modify_nm">고객정보출력관리</h4>
                            </div>
                            <div class="modal-body">
                                <form class="form-horizontal form-groups-bordered">
                                    <div>
                                        [고객관리카드] 를(을) 출력하시겠습니까?<br>
                                        ※고객정보는 개인정보관리 대상이므로 유의하셔야 합니다.
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-10">
                                            출력인원 : {{printInfo.custCount}}명
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <table class="table datatable dataTable">
                                            <thead>
                                                <tr class="replace-inputs">
                                                    <th style="width: 20%;" class="center">성명</th>
                                                    <th style="width: 20%;" class="center">생년월일</th>
                                                    <th style="width: 30%;" class="center">핸드폰번호</th>
                                                    <th style="width: 30%;" class="center">직업</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="item in printInfo.custList">
                                                    <td class="center">{{item.cust_nm}}</td>
                                                    <td class="center">{{item.rrno}}</td>
                                                    <td class="center">{{item.cust_mbl_telno}}</td>
                                                    <td class="center">{{item.occp_ty_cd_nm}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" @click="print">인쇄</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                    <div id="cust_mnglist_printArea" style="height:0px;display:none;">
                        <table class="table datatable dataTable">
                            <thead>
                                <tr class="replace-inputs">
                                    <th style="width: 20%;" class="center">성명</th>
                                    <th style="width: 20%;" class="center">생년월일</th>
                                    <th style="width: 30%;" class="center">핸드폰번호</th>
                                    <th style="width: 30%;" class="center">직업</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in printInfo.custList">
                                    <td class="center">{{item.cust_nm}}</td>
                                    <td class="center">{{item.rrno}}</td>
                                    <td class="center">{{item.cust_mbl_telno}}</td>
                                    <td class="center">{{item.occp_ty_cd_nm}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </div>
            <!--// 관리대장출력 팝업  -->

            <!-- 고객관리카드 출력 팝업 -->
            <div class="modal fade" id="pop_cust_card_print">
                <template>
                    <div class="modal-dialog4">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                    id="btn_popClose">&times;</button>
                                <h4 class="modal-title" id="modify_nm">고객관리카드 출력</h4>
                            </div>
                            <div class="modal-body">
                                <form class="form-horizontal form-groups-bordered">
                                    <div>
                                        [고객관리카드] 를(을) 출력하시겠습니까?<br>
                                        ※고객정보는 개인정보관리 대상이므로 유의하셔야 합니다.
                                    </div>
                                    <div class="clearAfter">
                                        <div class="left">
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">고객명</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_nm" v-model="info.cust_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">실명번호</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="rrno" v-model="info.rrno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">E-mail</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_eml_addr" v-model="info.cust_eml_addr">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">전화번호</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="co_tel_no" v-model="info.co_tel_no">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">핸드폰</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="cust_mbl_telno"
                                                        v-model="info.cust_mbl_telno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">직업</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="occp_ty_cd_nm" v-model="info.occp_ty_cd_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">주소</label>
                                                <div class="col-sm-9">
                                                    <textarea id="cust_addr" v-model="info.cust_addr"
                                                        style="width:100%;"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">담당자</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="pic_nm" v-model="info.pic_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">부서</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="dept_nm" v-model="info.dept_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">직위</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="jbps_ty_cd_nm" v-model="info.jbps_ty_cd_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">연락처</label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="pic_mbl_telno" v-model="info.pic_mbl_telno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-2 control-label">상담내역</label>
                                            </div>
                                            <div class="col-sm-10">
                                                <tr>
                                                    <textarea id="tsk_dtl_cn" v-model="info.tsk_dtl_cn"
                                                        style="width:100%;"></textarea>
                                                </tr>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" @click="print_card">인쇄</button>
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                    <div id="cust_mngcard_printArea" style="height:0px;display:none;">
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">고객명</label>
                            <div class="col-sm-9">
                                <input type="submit" id="cust_nm" v-model="info.cust_nm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">실명번호</label>
                            <div class="col-sm-9">
                                <input type="submit" id="rrno" v-model="info.rrno">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">E-mail</label>
                            <div class="col-sm-9">
                                <input type="submit" id="cust_eml_addr" v-model="info.cust_eml_addr">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">전화번호</label>
                            <div class="col-sm-9">
                                <input type="submit" id="co_tel_no" v-model="info.co_tel_no">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">핸드폰</label>
                            <div class="col-sm-9">
                                <input type="submit" id="cust_mbl_telno" v-model="info.cust_mbl_telno">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">직업</label>
                            <div class="col-sm-9">
                                <input type="submit" id="occp_ty_cd_nm" v-model="info.occp_ty_cd_nm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">주소</label>
                            <div class="col-sm-9">
                                <input type="submit" id="cust_addr" v-model="info.cust_addr">
                                <!-- <textarea  type="submit" id="cust_addr" v-model="info.cust_addr" style="width:100%;" ></textarea> -->
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">담당자</label>
                            <div class="col-sm-9">
                                <input type="submit" id="pic_nm" v-model="info.pic_nm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">부서</label>
                            <div class="col-sm-9">
                                <input type="submit" id="dept_nm" v-model="info.dept_nm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">직위</label>
                            <div class="col-sm-9">
                                <input type="submit" id="jbps_ty_cd_nm" v-model="info.jbps_ty_cd_nm">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_cd" class="col-sm-3 control-label">연락처</label>
                            <div class="col-sm-9">
                                <input type="submit" id="pic_mbl_telno" v-model="info.pic_mbl_telno">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="err_eng_nm" class="col-sm-2 control-label">상담내역</label>
                            <div class="col-sm-9">
                                <input type="submit" id="tsk_dtl_cn" v-model="info.tsk_dtl_cn">
                            </div>
                        </div>
                        <!-- <div class="col-sm-10">
						<tr>										
						   <textarea  type="submit" id="tsk_dtl_cn" v-model="info.tsk_dtl_cn" style="width:100%;" ></textarea>
						</tr> 
					</div>   -->
                    </div>
                </template>
            </div>
            <!--// 고객관리카드 출력 팝업  -->

            <!-- 담당자설정 팝업 -->
            <div class="modal fade" id="pop_damdang_set">
                <template>
                    <div class="modal-dialog4">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"
                                    id="btn_popClose">&times;</button>
                                <h4 class="modal-title" id="modify_nm">담당자 설정</h4>
                            </div>
                            <div class="modal-body">
                                <form class="form-horizontal form-groups-bordered">
                                    <div class="clearAfter">
                                        <div class="left">
                                            <div class="form-group">
                                                <label for="err_cd" class="col-sm-3 control-label">담당자명 : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="pic_nm" v-model="picInfo.pic_nm">
                                                    <button type="button" class="btn" @click="popupPicInfo">
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-blue btn-icon icon-left"
                                                        style="margin-left: 5px;" @click="damdangSave">
                                                        등록
                                                        <i class="entypo-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_kor_nm" class="col-sm-3 control-label">부서명 : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="dept_nm" v-model="picInfo.dept_nm">
                                                    <button type="button" class="btn btn-blue btn-icon icon-left"
                                                        style="margin-left: 5px;" @click="damdangDelete">
                                                        삭제
                                                        <i class="entypo-search"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">직위 : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="jbps_ty_cd_nm"
                                                        v-model="picInfo.jbps_ty_cd_nm">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">연락처 : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="pic_mbl_telno"
                                                        v-model="picInfo.pic_mbl_telno">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">E-mail : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="pic_eml_addr" v-model="picInfo.pic_eml_addr">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">입사일자 : </label>
                                                <div class="col-sm-9">
                                                    <input type="text" id="jncmp_ymd" v-model="picInfo.jncmp_ymd">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label for="err_eng_nm" class="col-sm-3 control-label">기타 : </label>
                                                <div class="col-sm-9">
                                                    <textarea id="etc_tsk_cn" v-model="picInfo.etc_tsk_cn"
                                                        style="width:100%;"></textarea>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <table class="table datatable dataTable">
                                                    <thead>
                                                        <tr class="replace-inputs">
                                                            <th style="width: 20%;" class="center">성명</th>
                                                            <th style="width: 20%;" class="center">생년월일</th>
                                                            <th style="width: 30%;" class="center">핸드폰번호</th>
                                                            <th style="width: 30%;" class="center">직업</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="item in picInfo.custList" style="cursor: pointer;">
                                                            <td class="center">{{item.cust_nm}}</td>
                                                            <td class="center">{{item.rrno}}</td>
                                                            <td class="center">{{item.cust_mbl_telno}}</td>
                                                            <td class="center">{{item.occp_ty_cd_nm}}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal"
                                    @click="popupPicClose">Close</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <!--// 담당자설정 팝업  -->
            <!-- 팝업 -->
            <div class="modal fade" id="pop_pic_info">
                <template>
                    <div class="modal-dialog" style="width: 500px;">
                        <div class="modal-content">
                            <div class="modal-body">
                                <div style="height: 400px;overflow: auto;" class="dataTables_wrapper">
                                    <table class="table table-bordered datatable dataTable">
                                        <thead style="position: sticky;top: 0px;">
                                            <tr>
                                                <th class="center" style="width: 20%;">담당자명</th>
                                                <th class="center" style="width: 20%;">부서명</th>
                                                <th class="center" style="width: 20%;">직위</th>
                                                <th class="center" style="width: 50%;">연락처</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in dataList" @click="selItem(item.pic_nm)"
                                                style="cursor: pointer;">
                                                <td class="center">{{item.pic_nm}}</td>
                                                <td class="center">{{item.dept_nm}}</td>
                                                <td class="center">{{item.jbps_ty_cd_nm}}</td>
                                                <td class="center">{{item.pic_mbl_telno}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <!-- 팝업 -->
        </body>
        <script>
            var vueapp = new Vue({
                el: "#vueapp",
                data: {
                    dataList: [],
                    search_nm: "",
                    cust_nm: "",
                    pic_nm: "",
                    rrno: "",
                    dept_nm: "",
                    search_val: "",
                },
                mounted: function () {
                    var fromDtl = cf_getUrlParam("fromDtl");
                    var pagingConfig = cv_sessionStorage.getItem("pagingConfig");
                    if ("Y" === fromDtl && !cf_isEmpty(pagingConfig)) {
                        cv_pagingConfig.pageNo = pagingConfig.pageNo;
                        cv_pagingConfig.orders = pagingConfig.orders;

                        var params = cv_sessionStorage.getItem("params");
                        this.search_nm = params.search_nm;
                        this.pic_nm = params.pic_nm;
                        this.dept_nm = params.dept_nm;
                        this.cust_nm = params.cust_nm;
                        this.rrno = params.rrno;
                        this.search_val = params.search_val;

                        this.getCustInfoList(true);
                    } else {
                        cv_sessionStorage
                            .removeItem("pagingConfig")
                            .removeItem("params");
                        this.getCustInfoList(true);
                    }
                },
                methods: {
                    getCustInfoList: function (isInit) {

                        cv_pagingConfig.func = this.getCustInfoList;
                        if (isInit === true) {
                            cv_pagingConfig.pageNo = 1;
                            cv_pagingConfig.orders = [{ target: "cust_nm", isAsc: false }];
                        }

                        var params = {
                            search_nm: this.search_nm,
                            search_val: this.search_val,
                            pic_nm: this.pic_nm,
                            dept_nm: this.dept_nm,
                            cust_nm: this.cust_nm,
                            rrno: this.rrno,
                        }

                        cv_sessionStorage
                            .setItem('pagingConfig', cv_pagingConfig)
                            .setItem('params', params);

                        cf_ajax("/custMng/getCustInfoList", params, this.getListCB);
                    },
                    getCustInfoListAll: function (isInit) {

                        cv_pagingConfig.func = this.getCustInfoListAll;
                        if (isInit === true) {
                            cv_pagingConfig.pageNo = 1;
                            cv_pagingConfig.orders = [{ target: "cust_nm", isAsc: false }];
                        }

                        var params = {
                            search_nm: this.search_nm,
                            search_val: this.search_val,
                        }

                        cv_sessionStorage
                            .setItem('pagingConfig', cv_pagingConfig)
                            .setItem('params', params);

                        cf_ajax("/custMng/getCustInfoListAll", params, this.getListCB);
                    },
                    getListCB: function (data) {
                        //console.log(data);
                        this.dataList = data.list;
                        cv_pagingConfig.renderPagenation("system");
                    },
                    gotoDtl: function (cust_mbl_telno) {
                        console.log(cust_mbl_telno);
                        pop_cust_info.init(cust_mbl_telno);
                        $('#pop_cust_info').modal('show');
                    },
                    sortList: function (obj) {
                        cf_setSortConf(obj, "cust_nm");
                        this.getCustInfoList();
                    },
                    sortListAll: function (obj) {
                        cf_setSortConf(obj, "cust_nm");
                        this.getCustInfoListAll();
                    },
                    all_check: function (obj) {
                        $('[name=is_check]').prop('checked', obj.checked);
                    },
                    onCheck: function () {
                        $("#allCheck").prop('checked',
                            $("[name=is_check]:checked").length === $("[name=is_check]").length
                        );
                    },
                    popCustmnglistPrint: function () {
                        var chkedList = $("[name=is_check]:checked");
                        if (chkedList.length == 0) {
                            alert("출력할 대상을 선택하여 주십시오.");
                            return;
                        }
                        //check list 가져오기..
                        var dateCopyList = [];
                        var idx;
                        chkedList.each(function (i) {
                            idx = $(this).attr("data-idx");
                            dateCopyList.push(vueapp.dataList.getElementFirst("cust_nm", idx));
                        });

                        console.log(dateCopyList);

                        //출력팝업 띄우기
                        pop_cust_mnglist_print.init(dateCopyList);
                        $('#pop_cust_mnglist_print').modal('show');

                    },
                    popCustmngCardPrint: function () {
                        var chkedList = $("[name=is_check]:checked");
                        if (chkedList.length == 0) {
                            alert("출력할 대상을 선택하여 주십시오.");
                            return;
                        } else if (chkedList.length > 1) {
                            alert("출력할 대상을 한개만 선택하여 주십시오.");
                            return;
                        }

                        //check list 가져오기..
                        var dateCopyList = [];
                        var idx;
                        chkedList.each(function (i) {
                            idx = $(this).attr("data-idx");
                            dateCopyList.push(vueapp.dataList.getElementFirst("cust_nm", idx));
                        });

                        console.log(dateCopyList);

                        //출력팝업 띄우기
                        pop_cust_card_print.init(dateCopyList);
                        $('#pop_cust_card_print').modal('show');
                    },
                    popDamdangSet: function () {
                        var chkedList = $("[name=is_check]:checked");
                        if (chkedList.length == 0) {
                            alert("담당자 설정 대상을 선택하여 주십시오.");
                            return;
                        }
                        //check list 가져오기..
                        var dateCopyList = [];
                        var idx;
                        chkedList.each(function (i) {
                            idx = $(this).attr("data-idx");
                            dateCopyList.push(vueapp.dataList.getElementFirst("cust_nm", idx));
                        });

                        console.log(dateCopyList);

                        //설정팝업 띄우기
                        pop_damdang_set.init(dateCopyList);
                        $('#pop_damdang_set').modal('show');

                    },
                    custInfoMng: function () {
                        cf_movePage('/custMng/custInfoMng');
                    },
                    picInfoMng: function () {
                        cf_movePage('/custMng/picInfoMng');
                    },
                },
            });

            var pop_cust_info = new Vue({
                el: "#pop_cust_info",
                data: {
                    info: {
                        cust_mbl_telno: "${cust_mbl_telno}",
                        wrt_dt: "",
                        cust_nm: "",
                        rrno: "",
                        cust_eml_addr: "",
                        co_telno: "",
                        occp_ty_cd_nm: "",
                        cust_addr: "",
                        tsk_dtl_cn: "",
                    }
                },
                methods: {
                    init: function (cust_mbl_telno) {
                        this.initInfo();
                        this.info.cust_mbl_telno = cust_mbl_telno;
                        if (!cf_isEmpty(this.info.cust_mbl_telno)) {
                            this.getInfo();
                        }
                    },
                    initInfo: function () {
                        this.info = {
                            cust_mbl_telno: "",
                            wrt_dt: "",
                            cust_nm: "",
                            rrno: "",
                            cust_eml_addr: "",
                            co_telno: "",
                            occp_ty_cd_nm: "",
                            cust_addr: "",
                            tsk_dtl_cn: "",
                        }
                    },
                    getInfo: function () {
                        var params = {
                            cust_mbl_telno: this.info.cust_mbl_telno,
                        }
                        cf_ajax("/custMng/getInfo", params, this.getInfoCB);
                    },
                    getInfoCB: function (data) {
                        this.info = data;
                    },
                },
            });

            var pop_cust_mnglist_print = new Vue({
                el: "#pop_cust_mnglist_print",
                data: {
                    printInfo: {
                        custCount: 0,
                        custList: [],
                    }
                },
                methods: {
                    init: function (dateCopyList) {
                        this.initInfo(dateCopyList);
                    },
                    initInfo: function (dateCopyList) {
                        this.printInfo = {
                            custCount: dateCopyList.length,
                            custList: dateCopyList,
                        }
                    },
                    print: function () {
                        const printArea = document.getElementById('cust_mnglist_printArea').innerHTML;
                        console.log(printArea);

                        win = window.open();
                        self.focus();
                        win.document.open();

                        /*
                        1. div 안의 모든 태그들을 innerHTML을 사용하여 매개변수로 받는다.
                        2. window.open() 을 사용하여 새 팝업창을 띄운다.
                        3. 열린 새 팝업창에 기본 <html><head><body>를 추가한다.
                        4. <body> 안에 매개변수로 받은 printArea를 추가한다.
                        5. window.print() 로 인쇄
                        6. 인쇄 확인이 되면 팝업창은 자동으로 window.close()를 호출하여 닫힘
                        */
                        win.document.write('<html><head>');

                        /*
                        win.document.write('<link rel="icon" href="/static_resources/system/images/favicon.ico">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/jquery-ui/css/no-theme/jquery-ui-1.10.3.custom.min.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/font-icons/entypo/css/entypo.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/lib/fonts/font-awesome-4.7.0/css/font-awesome.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/bootstrap.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-core.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-theme.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-forms.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/custom.css">');
                        */

                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');

                        win.document.write('<title></title><style>');
                        win.document.write('td.center {text-align: center;}');
                        win.document.write('th.center {text-align: center;}');
                        win.document.write('body {font-size: 14px;}');
                        //win.document.write('body, td {font-falmily: Verdana; font-size: 10pt;}');
                        win.document.write('</style></head><body>');
                        win.document.write(printArea);
                        win.document.write('</body></html>');
                        win.document.close();
                        win.print();
                        win.close();

                    },
                },
            });

            var pop_cust_card_print = new Vue({
                el: "#pop_cust_card_print",
                data: {
                    info: {
                        cust_mbl_telno: "",
                        cust_nm: "",
                        rrno: "",
                        cust_eml_addr: "",
                        co_telno: "",
                        occp_ty_cd_nm: "",
                        cust_addr: "",
                        pic_nm: "",
                        dept_nm: "",
                        jbps_ty_cd_nm: "",
                        pic_mbl_telno: "",
                        tsk_dtl_cn: "",
                    }
                },
                methods: {
                    init: function (dateCopyList) {
                        this.initInfo(dateCopyList);
                        this.info.cust_mbl_telno = dateCopyList[0].cust_mbl_telno;
                        //alert(this.info.cust_mbl_telno);
                        if (!cf_isEmpty(this.info.cust_mbl_telno)) {
                            this.getCustCardInfo();
                        }
                    },
                    initInfo: function () {
                        this.info = {
                            cust_nm: "",
                            rrno: "",
                            cust_mbl_telno: "",
                            cust_eml_addr: "",
                            co_telno: "",
                            occp_ty_cd_nm: "",
                            cust_addr: "",
                            pic_nm: "",
                            dept_nm: "",
                            jbps_ty_cd_nm: "",
                            pic_mbl_telno: "",
                            tsk_dtl_cn: "",
                        }
                    },
                    getCustCardInfo: function () {
                        var params = {
                            cust_mbl_telno: this.info.cust_mbl_telno,
                        }
                        //alert(cust_mbl_telno);
                        cf_ajax("/custMng/getCustCardInfo", params, this.getInfoCB);
                    },
                    getInfoCB: function (data) {
                        this.info = data;
                    },
                    print_card: function () {
                        const printArea = document.getElementById('cust_mngcard_printArea').innerHTML;
                        console.log(printArea);

                        win = window.open();
                        self.focus();
                        win.document.open();

                        /*
                        1. div 안의 모든 태그들을 innerHTML을 사용하여 매개변수로 받는다.
                        2. window.open() 을 사용하여 새 팝업창을 띄운다.
                        3. 열린 새 팝업창에 기본 <html><head><body>를 추가한다.
                        4. <body> 안에 매개변수로 받은 printArea를 추가한다.
                        5. window.print() 로 인쇄
                        6. 인쇄 확인이 되면 팝업창은 자동으로 window.close()를 호출하여 닫힘
                        */
                        //win.document.write('<html><head>');

                        /*
                        win.document.write('<link rel="icon" href="/static_resources/system/images/favicon.ico">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/jquery-ui/css/no-theme/jquery-ui-1.10.3.custom.min.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/font-icons/entypo/css/entypo.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/lib/fonts/font-awesome-4.7.0/css/font-awesome.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/bootstrap.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-core.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-theme.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/neon-forms.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/css/custom.css">');
                        */

                        // 			 win.document.write('<html><head>');

                        // 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
                        // 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
                        // 			 win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');

                        // 			 win.document.write('<title></title><style>');	
                        // 			 win.document.write('td.center {text-align: center;}');
                        // 			 win.document.write('th.center {text-align: center;}');
                        // 			 win.document.write('body {font-size: 14px;}');
                        // 			 win.document.write('</style></head><body>');
                        // 			 win.document.write(printArea);
                        // 			 win.document.write('</body></html>');
                        // 			 win.document.close();  
                        // 			 win.print();
                        // 			 win.close();

                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/datatables/datatables.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2-bootstrap.css">');
                        win.document.write('<link rel="stylesheet" href="/static_resources/system/js/select2/select2.css">');

                        win.document.write('<title></title><style>');
                        //win.document.write('td.center {text-align: center;}');
                        //win.document.write('th.center {text-align: center;}');
                        //win.document.write('body {font-size: 14px;}');
                        //win.document.write('body, td {font-falmily: Verdana; font-size: 10pt;}');
                        win.document.write('</style></head><body>');
                        win.document.write(printArea);
                        win.document.write('</body></html>');
                        win.document.close();
                        win.print();
                        win.close();
                    },
                },
            });

            var pop_damdang_set = new Vue({
                el: "#pop_damdang_set",
                data: {
                    picInfo: {
                        //custCount : 0,
                        pic_nm: "",
                        dept_nm: "",
                        jbps_ty_cd_nm: "",
                        pic_mbl_telno: "",
                        pic_eml_addr: "",
                        jncmp_ymd: "",
                        etc_tsk_cn: "",
                        custList: [],
                    }
                },
                methods: {
                    init: function (dateCopyList) {
                        this.initInfo(dateCopyList);
                        this.getInitInfo();
                    },
                    initInfo: function (dateCopyList) {
                        this.picInfo = {
                            pic_nm: pic_nm,
                            dept_nm: dept_nm,
                            jbps_ty_cd_nm: jbps_ty_cd_nm,
                            pic_mbl_telno: pic_mbl_telno,
                            pic_eml_addr: pic_eml_addr,
                            jncmp_ymd: jncmp_ymd,
                            etc_tsk_cn: etc_tsk_cn,
                            custList: dateCopyList,
                        }
                    },
                    getInitInfo: function () {
                        var params = {
                            pic_nm: "admin001",
                        }
                        cf_ajax("/custMng/getInitInfo", params, this.getInfoCB);
                    },
                    getInfoCB: function (data) {
                        this.picInfo.pic_nm = data.pic_nm;
                        this.picInfo.dept_nm = data.dept_nm;
                        this.picInfo.jbps_ty_cd_nm = data.jbps_ty_cd_nm;
                        this.picInfo.pic_mbl_telno = data.pic_mbl_telno;
                        this.picInfo.pic_eml_addr = data.pic_eml_addr;
                        this.picInfo.jncmp_ymd = data.jncmp_ymd;
                        this.picInfo.etc_tsk_cn = data.etc_tsk_cn;
                    },
                    popupPicInfo: function () {
                        pop_pic_info.init();
                        $('#pop_pic_info').modal('show');
                    },
                    getPicSelInfo: function (pic_nm) {
                        var params = {
                            pic_nm: pic_nm,
                        }
                        cf_ajax("/custMng/getInitInfo", params, this.getInfoCB);
                    },
                    popupPicClose: function () {
                        //pop_pic_info.init();
                        $('#pop_pic_info').modal('hide');
                    },
                    all_check: function (obj) {
                        $('[name=is_check]').prop('checked', obj.checked);
                    },
                    onCheck: function () {
                        $("#allCheck").prop('checked',
                            $("[name=is_check]:checked").length === $("[name=is_check]").length
                        );
                    },
                    damdangSave: function () {

                        var chkedList = $("[name=is_check]:checked");
                        if (chkedList.length == 0) {
                            alert("변경할 고객대상을 선택하여 주십시오.");
                            return;
                        }

                        //check list 가져오기..
                        var dateCopyList = [];
                        var idx;
                        chkedList.each(function (i) {
                            idx = $(this).attr("data-idx");
                            dateCopyList.push(pop_damdang_set.picInfo.custList.getElementFirst("cust_nm", idx));
                        });

                        // 			alert("dateCopyList==>" + dateCopyList);
                        // 			alert("dateCopyList.length==>" + dateCopyList.length);

                        // 			//var cust_mbl_telno_list = [];
                        // 			var cust_mbl_telno = [];

                        // 		    for (var i = 0; i < dateCopyList.length; i++) {
                        // 		    	cust_mbl_telno.push(dateCopyList[i].cust_mbl_telno);
                        // 		    }

                        // 		    alert("cust_mbl_telno_list==>" + cust_mbl_telno_list);

                        // 		    alert("cust_mbl_telno==>" + typeof(cust_mbl_telno));

                        var pic_mbl_telno_data = "";
                        pic_mbl_telno_data = pop_damdang_set.picInfo.pic_mbl_telno;

                        //alert("pic_mbl_telno==>" + pic_mbl_telno_data);

                        var params = {
                            dateCopyList: dateCopyList,
                            pic_mbl_telno: pic_mbl_telno_data,
                        }
                        cf_ajax("/custMng/updatePicRoof", params, this.changeStsCB);
                    },
                    changeStsCB: function (data) {
                        if (data.status == "OK") {
                            this.getInitInfo();
                            alert("담당자 변경 완료");
                        }
                    },
                    damdangDelete: function () {

                        var chkedList = $("[name=is_check]:checked");
                        if (chkedList.length == 0) {
                            alert("삭제할 고객대상을 선택하여 주십시오.");
                            return;
                        }

                        //check list 가져오기..
                        var dateCopyList = [];
                        var idx;
                        chkedList.each(function (i) {
                            idx = $(this).attr("data-idx");
                            dateCopyList.push(pop_damdang_set.picInfo.custList.getElementFirst("cust_nm", idx));
                        });

                        var params = {
                            dateCopyList: dateCopyList,
                        }
                        cf_ajax("/custMng/updateStcdRoof", params, this.changeStsCB);
                    },
                },
            });

            var pop_pic_info = new Vue({
                el: "#pop_pic_info",
                data: {
                    dataList: [],
                },
                methods: {
                    init: function () {
                        this.getPicInfo();
                    },
                    getPicInfo: function () {
                        this.dataList = [];
                        var params = {
                            pic_nm: " ",
                        }

                        cf_ajax("/custMng/getPicInfo", params, function (data) {
                            pop_pic_info.dataList = data;
                        });
                    },
                    selItem: function (pic_nm) {

                        //$('#pop_pic_info').modal('hide');
                        $('#pop_pic_info').hide();
                        pop_damdang_set.getPicSelInfo(pic_nm);
                    },
                },
            });
        </script>

        </html>