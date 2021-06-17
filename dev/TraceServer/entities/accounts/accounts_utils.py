def getRoomFromCtx(ctx):
    clientId, buCode, finYearId, branchId = ctx.get('clientId'), ctx.get(
        'buCode'), ctx.get('finYearId'), ctx.get('branchId')
    room = f'{str(clientId)}:{buCode}:{finYearId}:{branchId}'
    return(room)