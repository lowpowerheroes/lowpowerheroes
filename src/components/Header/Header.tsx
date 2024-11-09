'use client'

import {
    Flex,
    Heading,
    TextField,
    Button,
    Box,
    DropdownMenu,
} from '@radix-ui/themes'
import { FaSearch } from 'react-icons/fa'
import './style.css'

const Header = () => {
    const handleSearch = () => {
        console.log('searching...')
    }

    return (
        <header className="flex align-middle justify-between p-5 w-full border-secondary border-b-2">
            <Box className="flex-1">
                <Heading>Low Power Heroes</Heading>
            </Box>

            <Flex
                align={'center'}
                justify={'between'}
                gap={'3'}
                className="desktop-only"
            >
                <TextField.Root
                    placeholder="Search builds..."
                    size="3"
                    radius="full"
                    onChange={handleSearch}
                >
                    <TextField.Slot>
                        <FaSearch />
                    </TextField.Slot>
                </TextField.Root>
                <Button variant="soft" size={'3'} radius="full" asChild>
                    <a
                        href="mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
                        target="_blank"
                    >
                        Upload your build!
                    </a>
                </Button>
            </Flex>

            <Box className="mobile-only">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft">☰</Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="">
                        <DropdownMenu.Item>
                            <TextField.Root
                                placeholder="Search builds..."
                                size="3"
                                radius="full"
                                onChange={handleSearch}
                            >
                                <TextField.Slot>
                                    <FaSearch />
                                </TextField.Slot>
                            </TextField.Root>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item>
                            <Button
                                variant="soft"
                                size={'3'}
                                radius="full"
                                asChild
                            >
                                <a
                                    href="mailto:lowwpowerheroes@gmail.com?subject=Upload%20your%20build"
                                    target="_blank"
                                >
                                    Upload your build!
                                </a>
                            </Button>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Box>
        </header>
    )
}

export default Header
