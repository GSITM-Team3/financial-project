<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>임시</title>
	
</head>
<body>
	<br/><br><br>
	[testList]
	<table>
		<thead>
			<tr>
				<c:forEach var="unit" items="${testList[0]}">
					<th>${unit.key}|</th>
				</c:forEach>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="map" items="${testList}">
				<tr>
					<c:forEach var="unit" items="${map}">
						<td>${unit.value}|</td>
					</c:forEach>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<br/><br><br>
	[userListFromIam]
	<table>
		<thead>
			<tr>
				<c:forEach var="unit" items="${userListFromIam[0]}">
					<th>${unit.key}|</th>
				</c:forEach>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="map" items="${userListFromIam}" begin="0" end="200">
				<tr>
					<c:forEach var="unit" items="${map}">
						<td>${unit.value}|</td>
					</c:forEach>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<br/><br><br>
	[deptListFromIam]
	<table>
		<thead>
			<tr>
				<c:forEach var="unit" items="${deptListFromIam[0]}">
					<th>${unit.key}|</th>
				</c:forEach>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="map" items="${deptListFromIam}">
				<tr>
					<c:forEach var="unit" items="${map}">
						<td>${unit.value}|</td>
					</c:forEach>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	<br/><br><br>
	[codeListFromIam]
	<table>
		<thead>
			<tr>
				<c:forEach var="unit" items="${codeListFromIam[0]}">
					<th>${unit.key}|</th>
				</c:forEach>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="map" items="${codeListFromIam}">
				<tr>
					<c:forEach var="unit" items="${map}">
						<td>${unit.value}|</td>
					</c:forEach>
				</tr>
			</c:forEach>
		</tbody>
	</table>
	
</body>
</html>