import React, { useState, useEffect, useRef } from 'react'

const arbitraryData: any = {
    accounts: {
        all: [],
        journal: [],
    },
    header: {},
    deletedDetailsIds: [],
    debits: [{ key: 0 }],
    credits: [{ key: 0 }],
}

export { arbitraryData }